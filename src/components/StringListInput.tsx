import React, { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface StringListInputProps {
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  emptyMessage?: string
}

export function StringListInput({
  value = [],
  onChange,
  placeholder = 'Adicionar item...',
  emptyMessage = 'Nenhum item adicionado.',
}: StringListInputProps) {
  const [inputValue, setInputValue] = useState('')

  const handleAdd = (e?: React.MouseEvent | React.KeyboardEvent) => {
    e?.preventDefault()
    if (inputValue.trim()) {
      onChange([...value, inputValue.trim()])
      setInputValue('')
    }
  }

  const handleRemove = (index: number) => {
    const newValue = [...value]
    newValue.splice(index, 1)
    onChange(newValue)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdd(e)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1"
        />
        <Button
          type="button"
          onClick={handleAdd}
          variant="secondary"
          size="icon"
          disabled={!inputValue.trim()}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        {value?.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">{emptyMessage}</p>
        ) : (
          value?.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 rounded-md bg-muted/50 border border-border group"
            >
              <span className="text-sm">{item}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemove(index)}
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
