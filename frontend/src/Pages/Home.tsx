import { ArrowRightIcon, CloudArrowUpIcon, LightningIcon, MusicNotesIcon, SlidersHorizontalIcon, UploadSimpleIcon } from '@phosphor-icons/react'
import MainPage from '../component/MainPage.jsx'
import { useRef } from 'react'
import { useAudio } from '../AudioContext'
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const inputRef = useRef<HTMLInputElement>(null)
    const { setAudioFile } = useAudio()
    const navigate = useNavigate()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const isMp3 =
            file.type === 'audio/mpeg' || file.name.toLowerCase().endsWith('.mp3')
        if (!isMp3) {
            alert('Lütfen bir MP3 dosyası seçin.')
            return
        }
        setAudioFile(file)
        navigate('/pitch')
    }
        return (
        <div className="min-h-screen md:h-screen w-full overflow-x-hidden bg-[radial-gradient(ellipse_at_top_right,#2a2623_0%,#0d0c0b_60%)]">
            <div className='w-full h-fit flex flex-1 items-start justify-center text-[#F3E4C9] gap-3 md:gap-6 p-4 text-sm md:text-base'>
                <div className='text-xl font-bold flex flex-1'>
                    TuneFlex
                </div>
                <div className='text-m cursor-pointer'>
                    AnaSayfa
                </div>
                <div className='text-m cursor-pointer'>
                    Hakkında
                </div>
                <div className='text-m flex flex-1 cursor-pointer'>
                    İletişim
                </div>
            </div>
            <div className='flex flex-col md:flex-row flex-1'>
                <div className='flex flex-col h-fit w-full md:w-fit p-5 md:p-9 gap-3'>
                    <div className='font-semibold text-gray-200 bg-[#302A26] rounded-full w-fit md:w-full p-3 px-4 text-sm md:text-base'>
                        Tonu değiştir. Yeni Şarkılar Oluştur
                    </div>
                    <div className='font-serif text-gray-200 text-3xl md:text-4xl items-center p-2'>
                        <div>
                            Senin Müziğin,
                        </div>
                        <div className='flex flex-col gap-5'>
                            <div>
                                Senin tonun
                            </div>
                            <div className='w-full md:w-100 text-base md:text-lg'>
                                Ses dosyalarınızın perdesini kolayca ve hızla ayarlayın.
                                Yeni atmosferler yaratın, farklı tonlar keşfedin ve müziğinizi tamamen kendinize özgü kılın.
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-1 p-2 gap-4'>
                        <input
                            ref={inputRef}
                            type="file"
                            accept="audio/mpeg,.mp3"
                            hidden
                            onChange={handleChange}
                        />
                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            className='flex flex-1 text-black justify-center items-center bg-[#947c6b] rounded-full w-fit h-fit p-3 px-5 gap-3 cursor-pointer font-semibold hover:bg-[#836c5b] transition-all'>
                            <UploadSimpleIcon className='size-5' />
                            <div>Ses Yükle</div>
                        </button>
                        <div className='flex flex-1 text-[#a68d7b] justify-center items-center  rounded-full w-fit h-fit p-3 px-5 gap-3 cursor-pointer font-semibold '>
                            Daha Fazlası
                            <ArrowRightIcon></ArrowRightIcon>
                        </div>
                    </div>
                </div>
                <MainPage className="hidden md:flex ml-auto justify-end items-end md:w-fit" />
            </div>

            <div className='grid grid-cols-2 md:flex flex-1 w-full p-2 md:p-4 bg-[#232323] h-fit gap-2 md:gap-10 items-start md:items-center justify-items-center md:justify-center'>
                <div className='flex flex-col max-w-80 p-4'>
                    <div className='gap-2 flex flex-col'>
                        <div className='bg-[#373636] rounded-full p-2 w-fit'>
                            <MusicNotesIcon className='size-6 text-[#F3E4C9]' />
                        </div>
                        <div className='text-white'>
                            Kullanımı Kolay
                        </div>
                    </div>
                    <div className='text-[#f3e4c9a1]'>
                        Kolay arayüzle saniyeler içinde başlama
                    </div>
                </div>
                <div className='flex flex-col max-w-80 p-4'>
                    <div className='gap-2 flex flex-col'>
                        <div className='bg-[#373636] rounded-full p-2 w-fit'>
                            <SlidersHorizontalIcon className='size-6 text-[#F3E4C9]' />
                        </div>
                        <div className='text-white'>
                            Hassas Kontrol
                        </div>
                    </div>
                    <div className='text-[#f3e4c9a1]'>
                        Tonu hassasiyetle ayarlayın ve gerçek zamanlı dinleyin.
                    </div>
                </div>
                <div className='flex flex-col max-w-80 p-4'>
                    <div className='gap-2 flex flex-col'>
                        <div className='bg-[#373636] rounded-full p-2 w-fit'>
                            <LightningIcon className='size-6 text-[#F3E4C9]' />
                        </div>
                        <div className='text-white'>
                            Yüksek Kalite
                        </div>
                    </div>
                    <div className='text-[#f3e4c9a1]'>
                        Sesinizi her zaman net ve doğal tutun.
                    </div>
                </div>
                <div className='flex flex-col max-w-80 p-4'>
                    <div className='gap-2 flex flex-col'>
                        <div className='bg-[#373636] rounded-full p-2 w-fit'>
                            <CloudArrowUpIcon className='size-6 text-[#F3E4C9]' />
                        </div>
                        <div className='text-white'>
                            Kurulum Gerekmez
                        </div>
                    </div>
                    <div className='text-[#f3e4c9a1]'>
                        Doğrudan tarayıcıda çalışır.
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Home