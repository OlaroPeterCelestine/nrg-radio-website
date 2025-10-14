'use client'

import { useState, useEffect } from 'react'
import { apiUtils } from '@/lib/api-utils'
import Image from 'next/image'
import Link from 'next/link'

interface Client {
  id: number
  name: string
  image: string
  link?: string
}

export default function ClientCarousel() {
  // Initialize with empty array - no fallback data
  const [clients, setClients] = useState<Client[]>([])

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      console.log('Fetching clients from API...')
      
      // Try to fetch from API
      const data = await apiUtils.fetchClients()

      console.log('API clients data received:', data)
      console.log('Number of API clients:', data?.length || 0)
      
      // Update with API data if successful, duplicate for smooth animation
      if (data && data.length > 0) {
        // Duplicate clients multiple times for seamless continuous animation
        // We need at least 2 sets for the -100% animation to work perfectly
        const duplicatedClients = [...data, ...data]
        setClients(duplicatedClients)
      } else {
        // Fallback clients for testing
        const fallbackClients = [
          { id: 1, name: 'Sample Client 1', image: '/default-client.png', link: '#' },
          { id: 2, name: 'Sample Client 2', image: '/default-client.png', link: '#' },
          { id: 3, name: 'Sample Client 3', image: '/default-client.png', link: '#' },
          { id: 4, name: 'Sample Client 4', image: '/default-client.png', link: '#' },
          { id: 5, name: 'Sample Client 5', image: '/default-client.png', link: '#' },
          { id: 6, name: 'Sample Client 6', image: '/default-client.png', link: '#' },
        ]
        setClients([...fallbackClients, ...fallbackClients])
      }
    } catch (error) {
      console.error('Error fetching clients:', error)
      // Fallback clients for testing
      const fallbackClients = [
        { id: 1, name: 'Sample Client 1', image: '/default-client.png', link: '#' },
        { id: 2, name: 'Sample Client 2', image: '/default-client.png', link: '#' },
        { id: 3, name: 'Sample Client 3', image: '/default-client.png', link: '#' },
        { id: 4, name: 'Sample Client 4', image: '/default-client.png', link: '#' },
        { id: 5, name: 'Sample Client 5', image: '/default-client.png', link: '#' },
        { id: 6, name: 'Sample Client 6', image: '/default-client.png', link: '#' },
      ]
      setClients([...fallbackClients, ...fallbackClients])
    }
  }

  const isValidImageUrl = (url: string | null | undefined): boolean => {
    if (!url || url.trim() === '') return false
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const getImageSrc = (client: Client): string => {
    if (isValidImageUrl(client.image)) {
      return client.image
    }
    // No fallback - return empty string if no valid image
    return ''
  }

  return (
    <section className="text-white py-12 px-4 w-full">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold">Clientele</h2>
          </div>
          <Link 
            href="/clients"
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
          >
            View All Clients
          </Link>
        </header>

        {clients.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-4">
              <i className="fas fa-building text-4xl mb-4 block"></i>
              No clients available at the moment
            </div>
            <p className="text-gray-500">Check back later for our client partners</p>
          </div>
        ) : (
          <div className="relative overflow-hidden">
            <div className="clients-carousel-continuous">
              {clients.map((client, index) => (
                <div
                  key={`${client.id}-${index}`}
                  className="flex-shrink-0 mx-4"
                >
                  <div className="flex items-center justify-center p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300 group w-48 h-24">
                    {client.link ? (
                      <a
                        href={client.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full h-full flex items-center justify-center"
                      >
                        <Image
                          src={getImageSrc(client)}
                          alt={client.name || `Client ${client.id}`}
                          width={120}
                          height={90}
                          className="max-h-16 max-w-full object-contain group-hover:scale-110 transition-transform duration-300"
                          title={client.name || `Client ${client.id}`}
                        />
                      </a>
                    ) : (
                      <Image
                        src={getImageSrc(client)}
                        alt={client.name || `Client ${client.id}`}
                        width={120}
                        height={90}
                        className="max-h-16 max-w-full object-contain group-hover:scale-110 transition-transform duration-300"
                        title={client.name || `Client ${client.id}`}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  )
}
