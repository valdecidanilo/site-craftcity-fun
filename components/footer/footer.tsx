import Image from "next/image"
import * as styles from "@/components/footer/styles"

export function Footer() {
  return (
    <footer className={styles.footerWrapper}>
      <div className={styles.footerContainer}>
        <div className="flex items-center">
          <div className={styles.footerContent}>
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Dalle-CraftCity-Title-pbj0VPvEBUrdqam5Znd5qDuEzfGiOk.png"
              alt="Craft City Logo"
              width={120}
              height={60}
              className="object-contain"
            />
            <span className={styles.footerText}>CraftCity © 2025</span>
          </div>
        </div>
      </div>
    </footer>
  )
}