'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Trash2, RotateCcw } from 'lucide-react'

interface ActionItem {
  id: string
  task: string
  owner: string
  dueDate: string
  priority: 'high' | 'medium' | 'low'
}

interface ActionItemsTableProps {
  isEditing?: boolean
  onRegenerate?: () => void
}

export function ActionItemsTable({ isEditing = false, onRegenerate }: ActionItemsTableProps) {
  const [items, setItems] = useState<ActionItem[]>([
    { id: '1', task: 'Finalize creative assets', owner: 'Sarah Johnson', dueDate: '2026-03-22', priority: 'high' },
    { id: '2', task: 'Prepare budget breakdown', owner: 'Mike Chen', dueDate: '2026-03-20', priority: 'high' },
    { id: '3', task: 'Brief partnership team', owner: 'Sarah Johnson', dueDate: '', priority: 'medium' },
  ])

  const handleDeleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id))
  }

  const handleUpdateItem = (id: string, field: keyof ActionItem, value: string) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item))
  }

  const priorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50'
      case 'medium':
        return 'text-amber-600 bg-amber-50'
      case 'low':
        return 'text-green-600 bg-green-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-semibold text-foreground">Task</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground">Owner</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground">Due Date</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground">Priority</th>
              {isEditing && <th className="text-left py-3 px-4 font-semibold text-foreground w-10"></th>}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                <td className="py-3 px-4">
                  {isEditing ? (
                    <Input
                      value={item.task}
                      onChange={(e) => handleUpdateItem(item.id, 'task', e.target.value)}
                      className="h-8"
                    />
                  ) : (
                    <span className="text-foreground">{item.task}</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  {isEditing ? (
                    <Input
                      value={item.owner}
                      onChange={(e) => handleUpdateItem(item.id, 'owner', e.target.value)}
                      className="h-8"
                    />
                  ) : (
                    <span className="text-foreground">{item.owner}</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  {isEditing ? (
                    <Input
                      type="date"
                      value={item.dueDate}
                      onChange={(e) => handleUpdateItem(item.id, 'dueDate', e.target.value)}
                      className="h-8"
                    />
                  ) : (
                    <span className={item.dueDate ? 'text-foreground' : 'text-muted-foreground'}>
                      {item.dueDate ? new Date(item.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
                    </span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <span className={`text-xs font-semibold px-2 py-1 rounded capitalize ${priorityColor(item.priority)}`}>
                    {item.priority}
                  </span>
                </td>
                {isEditing && (
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-muted-foreground hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!isEditing && items.some(item => !item.dueDate) && (
        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded text-sm text-amber-700">
          <span>⚠</span>
          <span>{items.filter(i => !i.dueDate).length} action items have no due date</span>
        </div>
      )}
      {onRegenerate && (
        <Button variant="ghost" size="sm" onClick={onRegenerate} className="gap-2 text-primary hover:bg-primary/10">
          <RotateCcw className="w-4 h-4" />
          Regenerate this section
        </Button>
      )}
    </div>
  )
}
