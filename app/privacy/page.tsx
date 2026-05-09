import Link from 'next/link';
import styles from '../legal.module.css';

export default function PrivacyPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.glowOne} />
        <div className={styles.glowTwo} />

        <div className={styles.container}>
          <div className={styles.heroInner}>
            <p className={styles.eyebrow}>ReelWall Legal</p>

            <h1 className={styles.title}>Privacy Policy</h1>

            <p className={styles.subtitle}>
              ReelWall is built to help anglers preserve catches, build
              collections, and share stories. This policy explains what we
              collect, how we use it, and what control you have over your
              information.
            </p>

            <p className={styles.updated}>Last updated: May 2026</p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.card}>
            <p className={styles.intro}>
              By using ReelWall, you trust us with content that matters to you.
              We keep this policy straightforward and aim to collect only the
              information needed to operate the product.
            </p>

            <div className={styles.block}>
              <h2>1. Information We Collect</h2>

              <p>
                We may collect information you provide directly, including:
              </p>

              <ul>
                <li>
                  Account details such as email address, username, and profile
                  information
                </li>

                <li>
                  Photos, catch records, collection titles, descriptions, and
                  related content you upload
                </li>

                <li>
                  Settings and preferences connected to your ReelWall account
                </li>
              </ul>

              <p>
                We may also collect limited technical data needed to operate the
                service, such as device, app, and usage information.
              </p>
            </div>

            <div className={styles.block}>
              <h2>2. How We Use Information</h2>

              <ul>
                <li>Provide, maintain, and improve ReelWall</li>

                <li>
                  Store and display your catches, collections, and profile
                  content
                </li>

                <li>
                  Enable public sharing when you choose to make content public
                </li>

                <li>
                  Support account security, stability, and abuse prevention
                </li>

                <li>
                  Respond to support requests and service-related issues
                </li>
              </ul>
            </div>

            <div className={styles.block}>
              <h2>3. Public Content and Sharing</h2>

              <p>
                If you mark content as public, including mounted catches,
                collections, or shared records, that content may be viewable on
                the web by anyone with the link.
              </p>

              <p>
                You control whether your content is public or private and are
                responsible for the information you choose to share.
              </p>
            </div>

            <div className={styles.block}>
              <h2>4. Third-Party Services</h2>

              <p>
                ReelWall uses third-party infrastructure providers to support
                authentication, database storage, file storage, analytics, and
                service delivery.
              </p>

              <p>
                These providers process data only as needed to operate the
                service.
              </p>
            </div>

            <div className={styles.block}>
              <h2>5. LiveWell Vault and Preserved Records</h2>

              <p>
                ReelWall may offer optional preservation features through
                LiveWell Vault.
              </p>

              <p>
                When a user chooses to preserve a catch, related images,
                metadata, stories, and verification information may be stored
                using permanent or long-term storage infrastructure.
              </p>

              <p>
                Vaulted records may generate public verification pages,
                certificates, or shareable links intended to help preserve and
                verify fishing memories over time.
              </p>

              <p>
                Users control whether they choose to use these preservation
                features.
              </p>
            </div>

            <div className={styles.block}>
              <h2>6. Data Retention</h2>

              <p>
                We retain account and content data while your account remains
                active and as needed to provide the service.
              </p>

              <p>
                If you delete your account, we will remove your data within a
                reasonable period except where retention is required for legal,
                security, or operational reasons.
              </p>
            </div>

            <div className={styles.block}>
              <h2>7. Your Choices and Rights</h2>

              <ul>
                <li>
                  Access and update your profile information inside the app
                </li>

                <li>
                  Delete catches, collections, or other content you no longer
                  want stored
                </li>

                <li>
                  Request deletion of your account and associated data
                </li>
              </ul>
            </div>

            <div className={styles.block}>
              <h2>8. Children’s Privacy</h2>

              <p>
                ReelWall is not intended for children under 13, and we do not
                knowingly collect personal information from children under 13.
              </p>
            </div>

            <div className={styles.block}>
              <h2>9. Changes to This Policy</h2>

              <p>
                We may update this Privacy Policy from time to time. When we do,
                we will post the updated version on this page and revise the
                date above.
              </p>
            </div>

            <div className={styles.block}>
              <h2>10. Contact</h2>

              <p>
                Questions about this policy can be sent to{' '}
                <a
                  className={styles.link}
                  href="mailto:info@reelwall.app"
                >
                  info@reelwall.app
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>ReelWall</div>

          <div className={styles.footerLinks}>
            <Link href="/" className={styles.footerLink}>
              Home
            </Link>

            <Link href="/collections" className={styles.footerLink}>
              Collections
            </Link>

            <Link href="/vault" className={styles.footerLink}>
              Vault
            </Link>

            <Link href="/about" className={styles.footerLink}>
              About
            </Link>

            <Link href="/contact" className={styles.footerLink}>
              Contact
            </Link>

            <Link href="/privacy" className={styles.footerLink}>
              Privacy Policy
            </Link>

            <Link href="/terms" className={styles.footerLink}>
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}