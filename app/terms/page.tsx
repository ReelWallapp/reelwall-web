import Link from 'next/link';
import styles from '../legal.module.css';

export default function TermsPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.glowOne} />
        <div className={styles.glowTwo} />

        <div className={styles.container}>
          <div className={styles.heroInner}>
            <p className={styles.eyebrow}>ReelWall Legal</p>
            <h1 className={styles.title}>Terms of Service</h1>
            <p className={styles.subtitle}>
              These terms explain the rules for using ReelWall, including how
              your content is handled, what you can share publicly, and how we
              keep the platform safe and usable.
            </p>
            <p className={styles.updated}>Last updated: April 2026</p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.card}>
            <p className={styles.intro}>
              By using ReelWall, you agree to these Terms of Service. If you do
              not agree, please do not use the service.
            </p>

            <div className={styles.block}>
              <h2>1. Use of the Service</h2>
              <p>
                ReelWall is a platform for uploading, organizing, and sharing
                fishing-related content, including catches, collections, and stories.
                You agree to use ReelWall lawfully and in a way that does not harm
                the platform or other users.
              </p>
            </div>

            <div className={styles.block}>
              <h2>2. Your Content</h2>
              <p>
                You retain ownership of the content you upload. By posting content to
                ReelWall, you grant us a non-exclusive, worldwide, royalty-free license
                to host, store, reproduce, display, and distribute that content solely
                as needed to operate and improve the service.
              </p>
            </div>

            <div className={styles.block}>
              <h2>3. Public Collections</h2>
              <p>
                If you mark a collection as public, it may be accessible on the web and
                viewable by anyone with the link. You are responsible for what you choose
                to make public.
              </p>
            </div>

            <div className={styles.block}>
              <h2>4. Prohibited Content and Conduct</h2>
              <p>You may not upload, post, or share content that:</p>
              <ul>
                <li>Is illegal, fraudulent, abusive, threatening, or harmful</li>
                <li>Infringes another person’s intellectual property or privacy rights</li>
                <li>Contains sexually explicit, exploitative, or otherwise inappropriate material</li>
                <li>Attempts to interfere with, disrupt, or misuse ReelWall or its systems</li>
              </ul>
            </div>

            <div className={styles.block}>
              <h2>5. Account Responsibility</h2>
              <p>
                You are responsible for maintaining the confidentiality of your account
                credentials and for activity that occurs under your account.
              </p>
            </div>

            <div className={styles.block}>
              <h2>6. Content Removal and Account Termination</h2>
              <p>
                We reserve the right to remove content or suspend accounts that violate
                these terms, threaten the safety of the platform, or create legal or
                operational risk.
              </p>
            </div>

            <div className={styles.block}>
              <h2>7. Availability and Changes</h2>
              <p>
                ReelWall may evolve over time. We may update, change, suspend, or remove
                features without prior notice.
              </p>
            </div>

            <div className={styles.block}>
              <h2>8. Disclaimer and Limitation of Liability</h2>
              <p>
                ReelWall is provided on an “as is” and “as available” basis without warranties
                of any kind. To the maximum extent permitted by law, ReelWall is not liable for
                indirect, incidental, special, consequential, or punitive damages, including loss
                of data, content, or access.
              </p>
            </div>

            <div className={styles.block}>
              <h2>9. Changes to These Terms</h2>
              <p>
                We may revise these terms from time to time. Continued use of ReelWall after
                updated terms are posted means you accept those changes.
              </p>
            </div>

            <div className={styles.block}>
              <h2>10. Contact</h2>
              <p>
                Questions about these terms can be sent to{' '}
                <a className={styles.link} href="mailto:support@reelwall.app">
                  support@reelwall.app
                </a>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>ReelWall</div>
          <div className={styles.footerLinks}>
            <Link href="/" className={styles.footerLink}>Home</Link>
            <Link href="/collections" className={styles.footerLink}>Collections</Link>
            <Link href="/privacy" className={styles.footerLink}>Privacy Policy</Link>
            <Link href="/terms" className={styles.footerLink}>Terms of Service</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}