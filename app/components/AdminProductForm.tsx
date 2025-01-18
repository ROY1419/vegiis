"use client"
import React, { useState } from 'react'
import { useNotification } from './Notification'

export default function AdminProductForm() {
    const [loading, setLoading] = useState(false)
    const {showNotification} = useNotification()


    return (
        <div>AdminProductForm</div>
    )
}

