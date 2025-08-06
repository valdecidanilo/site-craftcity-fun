import { ChevronLeft, ChevronRight } from 'lucide-react'
import * as styles from '@/components/pagination/styles'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className={styles.wrapper}>
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={styles.navButton}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`${styles.pageButtonBase} ${
            currentPage === page
              ? styles.pageButtonActive
              : styles.pageButtonInactive
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={styles.navButton}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}
