'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Bold, Italic, Underline, Strikethrough, Subscript, Superscript, AlignLeft, AlignCenter, AlignRight, AlignJustify, List, ListOrdered, Link, Image, Table, Code, Undo, Redo, Highlighter, Type } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Input } from '@/components/ui/input'

const fontFamilies = ['Arial', 'Helvetica', 'Times New Roman', 'Courier', 'Verdana', 'Georgia', 'Palatino', 'Garamond', 'Bookman', 'Comic Sans MS', 'Trebuchet MS', 'Arial Black', 'Impact']
const fontSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72]
const colors = ['black', 'red', 'green', 'blue', 'yellow', 'purple', 'orange', 'pink']
const caseOptions = ['Sentence case', 'lowercase', 'UPPERCASE', 'Capitalize Each Word']

export default function AdvancedRichTextEditor() {
  const editorRef = useRef<HTMLDivElement>(null)
  const [content, setContent] = useState('')
  const [isMarkdownMode, setIsMarkdownMode] = useState(false)
  const [undoStack, setUndoStack] = useState<string[]>([])
  const [redoStack, setRedoStack] = useState<string[]>([])
  const [fontSize, setFontSize] = useState('12')
  const [textColor, setTextColor] = useState('black')

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault()
        handleUndo()
      } else if (e.ctrlKey && (e.key === 'y' || (e.shiftKey && e.key === 'Z'))) {
        e.preventDefault()
        handleRedo()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [undoStack, redoStack])

  const saveCursorPosition = () => {
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      const preSelectionRange = range.cloneRange()
      if (editorRef.current) {
        preSelectionRange.selectNodeContents(editorRef.current)
        preSelectionRange.setEnd(range.startContainer, range.startOffset)
        return preSelectionRange.toString().length
      }
    }
    return 0
  }

  const restoreCursorPosition = (cursorPosition: number) => {
    const selection = window.getSelection()
    if (selection && editorRef.current) {
      const range = document.createRange()
      range.setStart(editorRef.current, 0)
      range.collapse(true)
      let cursorIndex = 0
      const childNodes = Array.from(editorRef.current.childNodes)
      
      const traverseNodes = (node: Node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const length = node.textContent?.length || 0
          if (cursorIndex + length >= cursorPosition) {
            range.setStart(node, cursorPosition - cursorIndex)
            range.collapse(true)
            return true
          }
          cursorIndex += length
        } else {
          for (const childNode of Array.from(node.childNodes)) {
            if (traverseNodes(childNode)) {
              return true
            }
          }
        }
        return false
      }

      for (const childNode of childNodes) {
        if (traverseNodes(childNode)) {
          break
        }
      }

      selection.removeAllRanges()
      selection.addRange(range)
    }
  }

  const handleFormat = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
    handleContentChange()
  }

  const handleLinkAttachment = () => {
    const linkUrl = prompt('Enter the URL for the link:')
    if (linkUrl) {
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        const linkText = range.toString() || linkUrl
        const linkElement = document.createElement('a')
        linkElement.href = linkUrl
        linkElement.textContent = linkText
        linkElement.target = '_blank'
        linkElement.rel = 'noopener noreferrer'
        range.deleteContents()
        range.insertNode(linkElement)
      } else if (editorRef.current) {
        const linkElement = document.createElement('a')
        linkElement.href = linkUrl
        linkElement.textContent = linkUrl
        linkElement.target = '_blank'
        linkElement.rel = 'noopener noreferrer'
        editorRef.current.appendChild(linkElement)
      }
      handleContentChange()
    }
  }

  const handleImage = () => {
    const url = prompt('Enter the image URL:')
    if (url) {
      document.execCommand('insertImage', false, url)
      handleContentChange()
    }
  }

  const handleTable = () => {
    const rows = prompt('Enter the number of rows:')
    const cols = prompt('Enter the number of columns:')
    if (rows && cols) {
      let table = '<table border="1" style="border-collapse: collapse;">'
      for (let i = 0; i < parseInt(rows); i++) {
        table += '<tr>'
        for (let j = 0; j < parseInt(cols); j++) {
          table += '<td style="padding: 5px;">Cell</td>'
        }
        table += '</tr>'
      }
      table += '</table>'
      document.execCommand('insertHTML', false, table)
      handleContentChange()
    }
  }

  const handleCodeBlock = () => {
    const code = prompt('Enter your code:')
    if (code) {
      const formattedCode = `<pre><code>${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`
      document.execCommand('insertHTML', false, formattedCode)
      handleContentChange()
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      const file = files[0]
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (event) => {
          if (event.target && typeof event.target.result === 'string') {
            document.execCommand('insertImage', false, event.target.result)
            handleContentChange()
          }
        }
        reader.readAsDataURL(file)
      }
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault()
        const blob = items[i].getAsFile()
        if (blob) {
          const reader = new FileReader()
          reader.onload = (event) => {
            if (event.target && typeof event.target.result === 'string') {
              document.execCommand('insertImage', false, event.target.result)
              handleContentChange()
            }
          }
          reader.readAsDataURL(blob)
        }
        break
      }
    }
  }

  const toggleMarkdownMode = () => {
    setIsMarkdownMode(!isMarkdownMode)
    if (editorRef.current) {
      if (isMarkdownMode) {
        editorRef.current.innerHTML = content
      } else {
        setContent(editorRef.current.innerHTML)
      }
    }
  }

  const handleContentChange = () => {
    if (editorRef.current) {
      const cursorPosition = saveCursorPosition()
      const newContent = editorRef.current.innerHTML
      setUndoStack((prevStack) => [...prevStack, content])
      setRedoStack([])
      setContent(newContent)
      setTimeout(() => restoreCursorPosition(cursorPosition), 0)
    }
  }

  const handleUndo = () => {
    if (undoStack.length > 0) {
      const previousContent = undoStack[undoStack.length - 1]
      setRedoStack((prevStack) => [...prevStack, content])
      setContent(previousContent)
      setUndoStack((prevStack) => prevStack.slice(0, -1))
      if (editorRef.current) {
        editorRef.current.innerHTML = previousContent
      }
    }
  }

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextContent = redoStack[redoStack.length - 1]
      setUndoStack((prevStack) => [...prevStack, content])
      setContent(nextContent)
      setRedoStack((prevStack) => prevStack.slice(0, -1))
      if (editorRef.current) {
        editorRef.current.innerHTML = nextContent
      }
    }
  }

  const handleHighlight = () => {
    handleFormat('backColor', 'yellow')
  }

  const handleFontSizeChange = (size: string) => {
    setFontSize(size)
    handleFormat('fontSize', size)
  }

  const handleFontColor = (color: string) => {
    setTextColor(color)
    handleFormat('foreColor', color)
  }

  const handleChangeCase = (option: string) => {
    if (editorRef.current) {
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        let text = range.toString()
        
        switch (option) {
          case 'Sentence case':
            text = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
            break
          case 'lowercase':
            text = text.toLowerCase()
            break
          case 'UPPERCASE':
            text = text.toUpperCase()
            break
          case 'Capitalize Each Word':
            text = text.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())))
            break
        }

        range.deleteContents()
        range.insertNode(document.createTextNode(text))
        handleContentChange()
      }
    }
  }

  useEffect(() => {
    if (editorRef.current && !isMarkdownMode) {
      const range = document.createRange()
      const sel = window.getSelection()
      range.selectNodeContents(editorRef.current)
      range.collapse(false)
      sel?.removeAllRanges()
      sel?.addRange(range)
      editorRef.current.focus()
    }
  }, [content, isMarkdownMode])

  const FormatButton = ({ onClick, icon, label }: { onClick: () => void; icon: React.ReactNode; label: string }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" onClick={onClick} aria-label={label}>
            {icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )

  return (
    <div className="w-full max-w-4xl mx-auto p-4 border rounded-lg shadow-lg bg-background">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <FormatButton onClick={() => handleFormat('bold')} icon={<Bold className="h-4 w-4" />} label="Bold" />
        <FormatButton onClick={() => handleFormat('italic')} icon={<Italic className="h-4 w-4" />} label="Italic" />
        <FormatButton onClick={() => handleFormat('underline')} icon={<Underline className="h-4 w-4" />} label="Underline" />
        <FormatButton onClick={() => handleFormat('strikeThrough')} icon={<Strikethrough className="h-4 w-4" />} label="Strikethrough" />
        <FormatButton onClick={() => handleFormat('subscript')} icon={<Subscript className="h-4 w-4" />} label="Subscript" />
        <FormatButton onClick={() => handleFormat('superscript')} icon={<Superscript className="h-4 w-4" />} label="Superscript" />
        <FormatButton onClick={handleHighlight} icon={<Highlighter className="h-4 w-4" />} label="Highlight" />

        <Select onValueChange={(value) => handleFormat('fontName', value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Font Family" />
          </SelectTrigger>
          <SelectContent>
            {fontFamilies.map((font) => (
              <SelectItem key={font} value={font}>{font}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={handleFontSizeChange} value={fontSize}>
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Size" />
          </SelectTrigger>
          <SelectContent>
            {fontSizes.map((size) => (
              <SelectItem key={size} value={size.toString()}>{size}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="number"
          value={fontSize}
          onChange={(e) => handleFontSizeChange(e.target.value)}
          className="w-[80px]"
          min="1"
        />

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[130px] justify-start">
              <Type className="h-4 w-4 mr-2" />
              <span 
                className="w-4 h-4 rounded-full mr-2" 
                style={{ backgroundColor: textColor }}
              />
              Text Color
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="grid grid-cols-4 gap-2">
              {colors.map((color) => (
                <TooltipProvider key={color}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className="w-8 h-8 rounded-full p-0"
                        style={{ backgroundColor: color }}
                        onClick={() => handleFontColor(color)}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{color}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Select onValueChange={handleChangeCase}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Change case" />
          </SelectTrigger>
          <SelectContent>
            {caseOptions.map((option) => (
              <SelectItem key={option} value={option}>{option}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <FormatButton onClick={() => handleFormat('justifyLeft')} icon={<AlignLeft className="h-4 w-4" />} label="Align Left" />
        <FormatButton onClick={() => handleFormat('justifyCenter')} icon={<AlignCenter className="h-4 w-4" />} label="Align Center" />
        <FormatButton onClick={() => handleFormat('justifyRight')} icon={<AlignRight className="h-4 w-4" />} label="Align Right" />
        <FormatButton onClick={() => handleFormat('justifyFull')} icon={<AlignJustify className="h-4 w-4" />} label="Justify" />

        <FormatButton onClick={() => handleFormat('insertUnorderedList')} icon={<List className="h-4 w-4" />} label="Bullet List" />
        <FormatButton onClick={() => handleFormat('insertOrderedList')} icon={<ListOrdered className="h-4 w-4" />} label="Numbered List" />

        <FormatButton onClick={handleLinkAttachment} icon={<Link className="h-4 w-4" />} label="Insert Link" />
        <FormatButton onClick={handleImage} icon={<Image className="h-4 w-4" />} label="Insert Image" />
        <FormatButton onClick={handleTable} icon={<Table className="h-4 w-4" />} label="Insert Table" />
        <FormatButton onClick={handleCodeBlock} icon={<Code className="h-4 w-4" />} label="Insert Code Block" />

        <FormatButton onClick={handleUndo} icon={<Undo className="h-4 w-4" />} label="Undo" />
        <FormatButton onClick={handleRedo} icon={<Redo className="h-4 w-4" />} label="Redo" />

        <div className="flex items-center space-x-2">
          <Switch id="markdown-mode" checked={isMarkdownMode} onCheckedChange={toggleMarkdownMode} />
          <Label htmlFor="markdown-mode">Markdown Mode</Label>
        </div>
      </div>

      <Tabs defaultValue="visual" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="visual">Visual Editor</TabsTrigger>
          <TabsTrigger value="code">Code View</TabsTrigger>
        </TabsList>
        <TabsContent value="visual">
          {isMarkdownMode ? (
            <Textarea
              value={content}
              onChange={(e) => {
                setContent(e.target.value)
                handleContentChange()
              }}
              className="min-h-[300px] font-mono"
              placeholder="Enter your Markdown here..."
            />
          ) : (
            <div
              ref={editorRef}
              className="min-h-[300px] p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary [&_ol]:list-decimal [&_ol]:ml-4 [&_ul]:list-disc [&_ul]:ml-4 [&_a]:text-blue-500 [&_a]:underline"
              contentEditable
              onInput={handleContentChange}
              onDrop={handleDrop}
              onPaste={handlePaste}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}
        </TabsContent>
        <TabsContent value="code">
          <Textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value)
              handleContentChange()
            }}
            className="min-h-[300px] font-mono"
            placeholder={isMarkdownMode ? "Markdown code" : "HTML code"}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}