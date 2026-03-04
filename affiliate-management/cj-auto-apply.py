"""
CJ Affiliate - Auto Apply to Relevant Advertiser Programs
Logs in, searches for AI/SaaS/tech advertisers, applies to them.
"""
import asyncio
import os
from playwright.async_api import async_playwright
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

CJ_EMAIL = os.environ["CJ_EMAIL"]
CJ_PASS = os.environ["CJ_PASS"]
CJ_MEMBER_ID = os.environ["CJ_MEMBER_ID"]

# Search terms to find relevant advertisers
SEARCH_TERMS = [
    "AI", "artificial intelligence", "software", "SaaS",
    "writing tool", "design", "video editing", "productivity",
    "cloud", "hosting", "creative", "automation",
    "developer", "coding", "marketing", "SEO",
    "graphic design", "photo editing", "website builder",
    "email marketing", "project management", "CRM"
]

async def main():
    async with async_playwright() as p:
        # Headed browser so Matt can see what's happening
        browser = await p.chromium.launch(headless=False, slow_mo=500)
        context = await browser.new_context(viewport={"width": 1280, "height": 900})
        page = await context.new_page()

        # --- LOGIN ---
        print("[1/4] Logging into CJ...")
        await page.goto("https://members.cj.com/member/publisher/home.cj")
        await page.wait_for_load_state("networkidle")

        # Check if we need to log in
        if "login" in page.url.lower() or "signin" in page.url.lower():
            # Try to find email/username field
            email_sel = 'input[type="email"], input[name="email"], input[name="username"], #email, #username'
            pass_sel = 'input[type="password"], input[name="password"], #password'

            try:
                await page.wait_for_selector(email_sel, timeout=10000)
                await page.fill(email_sel, CJ_EMAIL)
                await page.fill(pass_sel, CJ_PASS)

                # Click submit
                submit = await page.query_selector('button[type="submit"], input[type="submit"]')
                if submit:
                    await submit.click()

                await page.wait_for_load_state("networkidle")
                print("   Logged in!")
            except Exception as e:
                print(f"   Login form not found as expected: {e}")
                print("   Please log in manually in the browser window...")
                input("   Press ENTER when you're logged in...")

        # --- NAVIGATE TO ADVERTISER DIRECTORY ---
        print("[2/4] Going to advertiser directory...")
        await page.goto(f"https://members.cj.com/member/{CJ_MEMBER_ID}/publisher/advertisers/findAdvertisers.cj")
        await page.wait_for_load_state("networkidle")
        await asyncio.sleep(2)

        applied = []
        skipped = []
        errors = []

        # --- SEARCH AND APPLY ---
        print("[3/4] Searching for relevant advertisers...")

        for term in SEARCH_TERMS:
            print(f"\n   Searching: '{term}'...")
            try:
                # Look for search input
                search_sel = 'input[type="search"], input[type="text"][placeholder*="earch"], input[name="keywords"], input.search-input, #keyword'
                search_input = await page.query_selector(search_sel)

                if search_input:
                    await search_input.fill("")
                    await search_input.fill(term)

                    # Press enter or click search button
                    search_btn = await page.query_selector('button[type="submit"], button.search-btn, .search-button, button:has-text("Search")')
                    if search_btn:
                        await search_btn.click()
                    else:
                        await search_input.press("Enter")

                    await page.wait_for_load_state("networkidle")
                    await asyncio.sleep(2)

                    # Find "Apply" or "Join" buttons
                    apply_buttons = await page.query_selector_all('a:has-text("Apply"), button:has-text("Apply"), a:has-text("Join"), button:has-text("Join Program")')

                    print(f"   Found {len(apply_buttons)} programs to apply to")

                    for btn in apply_buttons[:10]:  # Max 10 per search term to avoid spam
                        try:
                            # Get advertiser name if possible
                            parent = await btn.evaluate_handle("el => el.closest('tr, .advertiser-row, .card, [class*=\"advertiser\"]')")
                            name_el = await parent.query_selector('a[class*="name"], .advertiser-name, td:first-child a, h3, h4')
                            adv_name = await name_el.inner_text() if name_el else "Unknown"

                            print(f"   Applying to: {adv_name.strip()}")
                            await btn.click()
                            await asyncio.sleep(1.5)

                            # Check for application form / terms
                            agree_btn = await page.query_selector('button:has-text("Agree"), button:has-text("Accept"), button:has-text("Submit"), input[type="checkbox"]')
                            if agree_btn:
                                tag = await agree_btn.evaluate("el => el.tagName")
                                if tag == "INPUT":
                                    await agree_btn.check()
                                    submit = await page.query_selector('button:has-text("Submit"), button:has-text("Apply")')
                                    if submit:
                                        await submit.click()
                                else:
                                    await agree_btn.click()
                                await asyncio.sleep(1)

                            applied.append(adv_name.strip())

                            # Go back to search results
                            await page.go_back()
                            await page.wait_for_load_state("networkidle")
                            await asyncio.sleep(1)

                        except Exception as e:
                            errors.append(f"{term}: {str(e)[:50]}")
                            # Try to get back to search
                            await page.goto(f"https://members.cj.com/member/{CJ_MEMBER_ID}/publisher/advertisers/findAdvertisers.cj")
                            await page.wait_for_load_state("networkidle")
                            await asyncio.sleep(1)

            except Exception as e:
                errors.append(f"Search '{term}': {str(e)[:80]}")

        # --- SUMMARY ---
        print("\n" + "="*50)
        print("[4/4] DONE!")
        print(f"   Applied: {len(applied)} programs")
        print(f"   Errors:  {len(errors)}")

        if applied:
            print("\n   Programs applied to:")
            for name in applied:
                print(f"   ✅ {name}")

        if errors:
            print("\n   Errors:")
            for err in errors:
                print(f"   ❌ {err}")

        print("\n   Browser staying open so you can review.")
        print("   Close the browser window when done.")

        # Keep browser open
        try:
            await page.wait_for_event("close", timeout=600000)  # 10 min
        except:
            pass

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
