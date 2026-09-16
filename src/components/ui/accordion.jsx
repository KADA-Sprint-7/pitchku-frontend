import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "cn"

const AccordionContext = React.createContext({
  openItem: null,
  toggleItem: () => {},
  type: "single",
  collapsible: true,
})

function Accordion({
  children,
  type = "single",
  collapsible = true,
  defaultValue = null,
  className,
  ...props
}) {
  const [openItem, setOpenItem] = React.useState(defaultValue)

  const toggleItem = React.useCallback((value) => {
    setOpenItem((prev) => {
      if (prev === value) {
        return collapsible ? null : prev
      }
      return value
    })
  }, [collapsible])

  return (
    <AccordionContext.Provider value={{ openItem, toggleItem, type, collapsible }}>
      <div className={cn("space-y-3", className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  )
}

const AccordionItemContext = React.createContext({ value: "" })

function AccordionItem({ value, className, children, ...props }) {
  return (
    <AccordionItemContext.Provider value={{ value }}>
      <div
        className={cn(
          "rounded-2xl border border-slate-800/80 bg-[#0B111E]/80 overflow-hidden transition-all duration-200 hover:border-slate-700/80",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  )
}

function AccordionTrigger({ className, children, ...props }) {
  const { openItem, toggleItem } = React.useContext(AccordionContext)
  const { value } = React.useContext(AccordionItemContext)
  const isOpen = openItem === value

  return (
    <button
      type="button"
      onClick={() => toggleItem(value)}
      aria-expanded={isOpen}
      className={cn(
        "flex w-full items-center justify-between px-6 py-5 text-left text-base sm:text-lg font-bold text-white transition-all hover:text-amber-400 focus:outline-none",
        isOpen && "text-amber-400 bg-slate-900/40",
        className
      )}
      {...props}
    >
      <span className="flex-1 pr-4">{children}</span>
      <ChevronDown
        className={cn(
          "h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200",
          isOpen && "rotate-180 text-amber-400"
        )}
      />
    </button>
  )
}

function AccordionContent({ className, children, ...props }) {
  const { openItem } = React.useContext(AccordionContext)
  const { value } = React.useContext(AccordionItemContext)
  const isOpen = openItem === value

  if (!isOpen) return null

  return (
    <div
      className={cn(
        "px-6 pb-5 pt-1 text-sm sm:text-base text-slate-300 leading-relaxed border-t border-slate-800/60 bg-slate-950/40",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
