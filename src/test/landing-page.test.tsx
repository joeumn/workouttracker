import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { LandingPage } from '@/components/landing-page'

describe('LandingPage', () => {
  it('renders the main heading', () => {
    const mockOnLogin = () => {}
    render(<LandingPage onLogin={mockOnLogin} />)
    
    expect(screen.getByText('Transform Your Fitness Journey')).toBeInTheDocument()
  })

  it('renders feature cards', () => {
    const mockOnLogin = () => {}
    render(<LandingPage onLogin={mockOnLogin} />)
    
    expect(screen.getByText('Macro Tracking')).toBeInTheDocument()
    expect(screen.getByText('Groups & Community')).toBeInTheDocument()
    expect(screen.getByText('Personal Progress')).toBeInTheDocument()
  })

  it('renders call-to-action buttons', () => {
    const mockOnLogin = () => {}
    render(<LandingPage onLogin={mockOnLogin} />)
    
    expect(screen.getByText('Get Started')).toBeInTheDocument()
    expect(screen.getByText('Start Your Journey')).toBeInTheDocument()
  })
})