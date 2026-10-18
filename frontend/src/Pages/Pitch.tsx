import { useEffect, useRef, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { PitchShifter, SoundTouch, SimpleFilter, WebAudioBufferSource } from 'soundtouchjs'
import { Mp3Encoder } from '@breezystack/lamejs'
import { useAudio } from '../AudioContext'
import { ArrowLeftIcon } from '@phosphor-icons/react'


const BUFFER_SIZE = 16384

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const tuneStretch = (st: any, sampleRate: number) => {
    try { st.stretch.setParameters(sampleRate, 40, 15, 12) } catch {}
}

const Waveform = ({ buffer, progress }: { buffer: AudioBuffer | null; progress: number }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!buffer || !canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        const { width, height } = canvas
        const data = buffer.getChannelData(0)
        const step = Math.floor(data.length / width)

        ctx.clearRect(0, 0, width, height)
        ctx.fillStyle = '#947c6b'
        for (let x = 0; x < width; x++) {
            let peak = 0
            for (let i = 0; i < step; i++) {
                const v = Math.abs(data[x * step + i])
                if (v > peak) peak = v
            }
            const h = Math.max(1, peak * height)
            ctx.fillRect(x, (height - h) / 2, 1, h)
        }
    }, [buffer])

    return (
        <div className="relative max-w-3xl">
            <canvas ref={canvasRef} width={1000} height={120} className="w-full h-24" />
            <div
                className="absolute top-0 bottom-0 w-0.5 bg-[#F3E4C9]"
                style={{ left: `${progress}%` }}
            />
        </div>
    )
}

const Pitch = () => {
    const { audioFile } = useAudio()
    const ctxRef = useRef<AudioContext | null>(null)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const shifterRef = useRef<any>(null)
    const [buffer, setBuffer] = useState<AudioBuffer | null>(null)
    const [ready, setReady] = useState(false)
    const [playing, setPlaying] = useState(false)
    const [exporting, setExporting] = useState(false)
    const [progress, setProgress] = useState(0)
    const [semitones, setSemitones] = useState(0)
    const [speed, setSpeed] = useState(1)

    useEffect(() => {
        if (!audioFile) return
        let cancelled = false
        const ctx = new AudioContext()
        ctxRef.current = ctx

            ; (async () => {
                const decoded = await ctx.decodeAudioData(await audioFile.arrayBuffer())
                if (cancelled) return
                setBuffer(decoded)

                const shifter = new PitchShifter(ctx, decoded, BUFFER_SIZE)
                tuneStretch(shifter._soundtouch, ctx.sampleRate)
                shifter.on('play', (e: { percentagePlayed: number; timePlayed: number }) => {
                    setProgress(e.percentagePlayed)
                    if (e.timePlayed >= shifter.duration - 0.05) {
                        shifter.disconnect()
                        setPlaying(false)
                        setProgress(0)
                    }
                })
                shifterRef.current = shifter
                setReady(true)
            })()

        return () => {
            cancelled = true
            shifterRef.current?.disconnect()
            shifterRef.current = null
            ctx.close()
            setBuffer(null)
            setReady(false)
            setPlaying(false)
            setProgress(0)
        }
    }, [audioFile])

    useEffect(() => {
        if (shifterRef.current) shifterRef.current.tempo = speed
    }, [speed, ready])

    useEffect(() => {
        if (shifterRef.current) shifterRef.current.pitchSemitones = semitones
    }, [semitones, ready])

    const toggle = async () => {
        const shifter = shifterRef.current
        const ctx = ctxRef.current
        if (!shifter || !ctx || !ready) return
        if (playing) {
            shifter.disconnect()
            setPlaying(false)
        } else {
            await ctx.resume()
            shifter.percentagePlayed = 0 
            setProgress(0)
            shifter.connect(ctx.destination)
            setPlaying(true)
        }
    }

    const download = async () => {
        if (!buffer || !audioFile || exporting) return
        shifterRef.current?.disconnect()
        setPlaying(false)
        setExporting(true)
        await new Promise((r) => setTimeout(r)) 

        try {
            const st = new SoundTouch()
            st.tempo = speed
            st.pitchSemitones = semitones
            tuneStretch(st, buffer.sampleRate)
            const filter = new SimpleFilter(new WebAudioBufferSource(buffer), st)

            const encoder = new Mp3Encoder(2, buffer.sampleRate, 192)
            const mp3: Uint8Array[] = []
            const CHUNK = 9216
            const pcm = new Float32Array(CHUNK * 2)
            const left = new Int16Array(CHUNK)
            const right = new Int16Array(CHUNK)
            const toInt16 = (x: number) => Math.max(-1, Math.min(1, x)) * 32767

            let n = 0
            let frames: number
            while ((frames = filter.extract(pcm, CHUNK)) > 0) {
                for (let i = 0; i < frames; i++) {
                    left[i] = toInt16(pcm[i * 2])
                    right[i] = toInt16(pcm[i * 2 + 1])
                }
                const out = encoder.encodeBuffer(left.subarray(0, frames), right.subarray(0, frames))
                if (out.length) mp3.push(out)
                if (n++ % 50 === 0) await new Promise((r) => setTimeout(r))
            }
            mp3.push(encoder.flush())

            const url = URL.createObjectURL(new Blob(mp3 as BlobPart[], { type: 'audio/mpeg' }))
            const a = document.createElement('a')
            a.href = url
            a.download = `${audioFile.name.replace(/\.[^.]+$/, '')}-pitch.mp3`
            a.click()
            URL.revokeObjectURL(url)
        } catch (err) {
            console.error('İndirme hatası:', err)
        } finally {
            setExporting(false)
        }
    }

    if (!audioFile) return <Navigate to="/" replace />

    return (
        <div className="h-screen w-full bg-[#0d0c0b] text-[#F3E4C9] p-8 flex flex-col gap-6 items-center justify-center">
            <div className='flex'>
                <Link to={"/"}><ArrowLeftIcon className='flex left-10 fixed size-8'></ArrowLeftIcon></Link>
                <h1 className="text-2xl font-bold ">Ton ayarlama Sayfası</h1>
            </div>
            <p className='mb-auto'>{audioFile.name}</p>

            <div className='mb-auto'>
                <Waveform buffer={buffer} progress={progress} />
            </div>

            <div className="flex items-center gap-4 max-w-xl">
                <span className="w-12">Pitch</span>
                <input
                    type="range" min="-12" max="12" step="1"
                    value={semitones}
                    onChange={(e) => setSemitones(Number(e.target.value))}
                    className="flex-1"
                />
                <span className="w-12 text-right">{semitones > 0 ? `+${semitones}` : semitones}</span>
            </div>

            <div className="flex items-center gap-4 max-w-xl mb-auto">
                <span className="w-12">Hız</span>
                <input
                    type="range" min="0.25" max="2" step="0.05"
                    value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                    className="flex-1"
                />
                <span className="w-12 text-right">{speed.toFixed(2)}x</span>
            </div>
            <div className="flex items-center gap-4">
                <button
                    onClick={toggle}
                    disabled={!ready || exporting}
                    className="w-fit bg-[#947c6b] text-black font-semibold rounded-full px-6 py-3 hover:bg-[#836c5b] transition-all disabled:opacity-50"
                >
                    {!ready ? 'Yükleniyor...' : playing ? 'Durdur' : 'Çal'}
                </button>
                <button
                    onClick={download}
                    disabled={!ready || exporting}
                    className="w-fit border border-[#947c6b] font-semibold rounded-full px-6 py-3 hover:bg-[#947c6b] hover:text-black transition-all disabled:opacity-50"
                >
                    {exporting ? 'İşleniyor...' : 'İndir (MP3)'}
                </button>
            </div>
        </div>
    )
}

export default Pitch