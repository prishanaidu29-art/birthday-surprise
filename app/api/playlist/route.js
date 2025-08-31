// app/api/playlist/route.js
import { NextResponse } from 'next/server'
import { getPlaylistData } from '../../../lib/spotify'

export async function GET() {
  try {
    const playlistData = await getPlaylistData()
    
    if (!playlistData) {
      return NextResponse.json(
        { error: 'Failed to fetch playlist data' },
        { status: 500 }
      )
    }

    return NextResponse.json(playlistData)
  } catch (error) {
    console.error('Error in playlist API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'