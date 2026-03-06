import React from 'react'
import { Link } from 'react-router-dom'

const Footer: React.FC = () => {
    return (
        <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
            <div className="container mx-auto px-6 text-center">
                <p>© 2026 Bookify SaaS. All rights reserved.</p>
            </div>
        </footer>
    )
}

export default Footer
