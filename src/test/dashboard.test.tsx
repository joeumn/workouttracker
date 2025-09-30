import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Dashboard } from '@/components/dashboard'

describe('Dashboard', () => {
  it('renders user welcome message', () => {
    const mockOnLogout = () => {}
    render(<Dashboard onLogout={mockOnLogout} />)
    
    expect(screen.getByText('Welcome, Demo User')).toBeInTheDocument()
  })

  it('renders daily check-in section', () => {
    const mockOnLogout = () => {}
    render(<Dashboard onLogout={mockOnLogout} />)
    
    expect(screen.getByText('Daily Check-in')).toBeInTheDocument()
    expect(screen.getByText('How are you feeling today?')).toBeInTheDocument()
  })

  it('renders macro tracking section', () => {
    const mockOnLogout = () => {}
    render(<Dashboard onLogout={mockOnLogout} />)
    
    expect(screen.getByText("Today's Macros")).toBeInTheDocument()
    expect(screen.getByText('Track your nutrition goals - focus on protein!')).toBeInTheDocument()
  })

  it('renders streak and XP information', () => {
    const mockOnLogout = () => {}
    render(<Dashboard onLogout={mockOnLogout} />)
    
    expect(screen.getByText('7 day streak')).toBeInTheDocument()
    expect(screen.getByText('Level 5 (1250 XP)')).toBeInTheDocument()
  })
})