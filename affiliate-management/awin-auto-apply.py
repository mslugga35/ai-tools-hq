"""
Awin - Auto Apply to Relevant Merchant Programs
Logs in, browses merchant directory, applies to AI/SaaS/tech merchants.
"""
import asyncio
import os
from playwright.async_api import async_playwright
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

AWIN_EMAIL = os.environ["AWIN_EMAIL"]
AWIN_PASS = os.environ["AWIN_PASS"]
AWIN_AFF_ID = os.environ["AWIN_AFF_ID"]

# Categories / search terms for relevant merchants
SEARCH_TERMS = [
    "AI", "software", "SaaS", "technology",
    "writing", "design", "video", "productivity",
    "cloud", "hosting", "creative", "automation",
    "developer tools", "marketing", "SEO",
    "website builder", "email", "project management"
]

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False, slow_mo=500)
        context = await browser.new_context(viewport={"width": 1280, "height": 900})
        page = await context.new_page()

        # --- LOGIN ---
        print("[1/4] Logging into Awin...")
        await page.goto("https://ui.awin.com/user/login")
        await page.wait_for_load_state("networkidle")

        if "login" in page.url.lower():
            try:
                email_sel = 'input[type="email"], input[name="email"], #email'
                pass_sel = 'input[type="password"], input[name="password"], #password'

                await page.wait_for_selector(email_sel, timeout=10000)
                await page.fill(email_sel, AWIN_EMAIL)
                await page.fill(pass_sel, AWIN_PASS)

                submit = await page.query_selector('button[type="submit"], input[type="submit"]')
                if submit:
                    await submit.click()

                await page.wait_for_load_state("networkidle")
                await asyncio.sleep(3)
                print("   Logged in!")
            except Exception as e:
                print(f"   Login form issue: {e}")
                print("   Please log in manually in the browser window...")
                input("   Press ENTER when you're logged in...")

        # --- NAVIGATE TO MERCHANT DIRECTORY ---
        print("[2/4] Going to merchant directory...")
        await page.goto(f"https://ui.awin.com/awin/affiliate/{AWIN_AFF_ID}/merchant-directory/index/tab/notJoined/page/1")
        await page.wait_for_load_state("networkidle")
        await asyncio.sleep(2)

        applied = []
        errors = []

        # --- BROWSE AND APPLY ---
        print("[3/4] Browsing merchants and applying...")

        for term in SEARCH_TERMS:
            print(f"\n   Searching: '{term}'...")
            try:
                # Navigate to directory with search
                search_sel = 'input[type="search"], input[type="text"][placeholder*="earch"], input[name="search"], input[name="keyword"], .search-input'
                search_input = await page.query_selector(search_sel)

                if search_input:
                    await search_input.fill("")
                    await search_input.fill(term)

                    search_btn = await page.query_selector('button[type="submit"], button.search-btn, button:has-text("Search"), button:has-text("Filter")')
                    if search_btn:
                        await search_btn.click()
                    else:
                        await search_input.press("Enter")

                    await page.wait_for_load_state("networkidle")
                    await asyncio.sleep(2)

                # Find "Join Programme" / "Apply" buttons
                join_buttons = await page.query_selector_all(
                    'button:has-text("Join"), a:has-text("Join"), '
                    'button:has-text("Apply"), a:has-text("Apply"), '
                    'button:has-text("Join Programme"), a:has-text("Join Programme")'
                )

                print(f"   Found {len(join_buttons)} merchants to apply to")

                for btn in join_buttons[:10]:  # Max 10 per term
                    try:
                        # Try to get merchant name
                        row = await btn.evaluate_handle("el => el.closest('tr, .merchant-row, .card, [class*=\"merchant\"], [class*=\"program\"]')")
                        name_el = await row.query_selector('a[class*="name"], .merchant-name, .program-name, td:first-child a, h3, h4, span.name')
                        merchant_name = await name_el.inner_text() if name_el else "Unknown"

                        print(f"   Joining: {merchant_name.strip()}")
                        await btn.click()
                        await asyncio.sleep(2)

                        # Handle confirmation dialog/modal if present
                        confirm = await page.query_selector(
                            'button:has-text("Confirm"), button:has-text("Accept"), '
                            'button:has-text("Submit"), button:has-text("Yes")'
                        )
                        if confirm:
                            await confirm.click()
                            await asyncio.sleep(1)

                        # Check for terms checkbox
                        checkbox = await page.query_selector('input[type="checkbox"]')
                        if checkbox:
                            await checkbox.check()
                            submit = await page.query_selector('button:has-text("Submit"), button:has-text("Join"), button:has-text("Apply")')
                            if submit:
                                await submit.click()
                            await asyncio.sleep(1)

                        applied.append(merchant_name.strip())

                    except Exception as e:
                        errors.append(f"{term}: {str(e)[:50]}")

                # Go back to directory for next search
                await page.goto(f"https://ui.awin.com/awin/affiliate/{AWIN_AFF_ID}/merchant-directory/index/tab/notJoined/page/1")
                await page.wait_for_load_state("networkidle")
                await asyncio.sleep(1)

            except Exception as e:
                errors.append(f"Search '{term}': {str(e)[:80]}")

        # --- ALSO: BROWSE PAGES WITHOUT SEARCH ---
        print("\n   Also browsing first 5 pages of all merchants...")
        for pg in range(1, 6):
            try:
                await page.goto(f"https://ui.awin.com/awin/affiliate/{AWIN_AFF_ID}/merchant-directory/index/tab/notJoined/page/{pg}")
                await page.wait_for_load_state("networkidle")
                await asyncio.sleep(2)

                join_buttons = await page.query_selector_all(
                    'button:has-text("Join"), a:has-text("Join"), '
                    'button:has-text("Apply"), a:has-text("Apply")'
                )

                # Only apply to ones that look tech/software related
                # (we'll apply to all since the directory is filtered by "not joined")
                for btn in join_buttons[:15]:
                    try:
                        row = await btn.evaluate_handle("el => el.closest('tr, .merchant-row, .card, [class*=\"merchant\"]')")
                        name_el = await row.query_selector('a, .merchant-name, .program-name, h3, h4, span.name')
                        merchant_name = await name_el.inner_text() if name_el else "Unknown"

                        # Skip if already applied
                        if merchant_name.strip() in applied:
                            continue

                        print(f"   Page {pg} - Joining: {merchant_name.strip()}")
                        await btn.click()
                        await asyncio.sleep(1.5)

                        confirm = await page.query_selector('button:has-text("Confirm"), button:has-text("Accept"), button:has-text("Yes")')
                        if confirm:
                            await confirm.click()
                            await asyncio.sleep(1)

                        applied.append(merchant_name.strip())

                    except:
                        pass

            except Exception as e:
                errors.append(f"Page {pg}: {str(e)[:50]}")

        # --- SUMMARY ---
        print("\n" + "="*50)
        print("[4/4] DONE!")
        print(f"   Applied: {len(applied)} merchants")
        print(f"   Errors:  {len(errors)}")

        if applied:
            print("\n   Merchants applied to:")
            for name in applied:
                print(f"   ✅ {name}")

        if errors:
            print("\n   Errors:")
            for err in errors:
                print(f"   ❌ {err}")

        print("\n   Browser staying open so you can review.")
        print("   Close the browser window when done.")

        try:
            await page.wait_for_event("close", timeout=600000)
        except:
            pass

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
