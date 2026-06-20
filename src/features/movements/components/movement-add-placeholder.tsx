import { motion } from "motion/react"
import { Plus } from "lucide-react"

interface MovementAddPlaceholderProps {
  onAdd: () => void
}

export function MovementAddPlaceholder({ onAdd }: MovementAddPlaceholderProps) {
  return (
    <motion.button
      type="button"
      onClick={onAdd}
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      whileHover={{ scale: 1.01, y: -1 }}
      whileTap={{ scale: 0.99 }}
      className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/20 px-4 py-8 text-center transition-colors hover:border-primary/40 hover:bg-primary/5"
    >
      <div className="flex size-10 items-center justify-center rounded-full border border-dashed border-muted-foreground/40 text-muted-foreground transition-colors group-hover:border-primary group-hover:text-primary">
        <Plus className="h-5 w-5" />
      </div>
      <span className="text-sm font-medium text-muted-foreground">Adicionar Produto</span>
    </motion.button>
  )
}
