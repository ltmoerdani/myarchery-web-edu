import React from 'react'
import logo_myarchery from "assets/images/myachery/myachery.png"
import styled from 'styled-components'

const WrapperImg = styled.div`
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    widht: 100px;
    height: 100px;
`

function PolicyArcher() {
    return (
        <React.Fragment>
            <div className='position-relative' style={{padding: '32px 0 72px 0'}}>
                <WrapperImg>
                    <img style={{objectFit: 'cover', width: '100%', height: '100%'}} src={logo_myarchery} />
                </WrapperImg>
            </div>
            <div className='container'>
                <div>
                    <h3 className='mt-5'>
                    Kebijakan Privasi
                    </h3>
                    <p className='font-size-14' style={{textAlign: 'justify'}}>
                        Reka Cipta Digital sebagai pemilik dan pengelola situs dan aplikasi MyArchery (“Kami”) memahami dan menjunjung tinggi perlindungan atas data privasi yang dimiliki Pengguna. Informasi pribadi Pengguna pada saat mendaftar di situs dan aplikasi MyArchery atau pada saat menggunakan layanan di situs maupun aplikasi MyArchery akan tetap dijaga kerahasiaannya sebagaimana diuraikan dalam Syarat & Ketentuan. Pada saat Pengguna menghubungi Kami, maka Kami menyimpan catatan mengenai korespondensi tersebut dan isi dari komunikasi antara Pengguna dan Kami. Kerahasiaan akun dan password merupakan tanggung jawab masing-masing Pengguna. Kami tidak bertanggung jawab atas kerugian yang dapat ditimbulkan akibat kelalaian Pengguna dalam menjaga kerahasiaan password.
                    </p>
                </div>
                <div>
                    <h3 className='mt-5'>
                        Penggunaan Informasi
                    </h3>
                    <p className='font-size-14' style={{textAlign: 'justify'}}>
                    Kami dapat menggunakan keseluruhan informasi/ data Pengguna untuk kebutuhan internal Kami terkait riset, promosi layanan baru, penawaran khusus, maupun informasi lain, dimana Kami dapat menghubungi Pengguna melalui email, surat, telepon, fax atau aplikasi chat. Kami dapat meminta Pengguna melengkapi survei untuk tujuan penelitian atau lainnya meskipun Pengguna tidak harus menanggapinya.
                    </p>
                </div>
                <div>
                    <h3 className='mt-5'>
                        Pengungkapan informasi Pengguna
                    </h3>
                    <p className='font-size-14' style={{textAlign: 'justify'}}>
                    Kami menjamin tidak ada penjualan, pengalihan, distribusi atau meminjamkan informasi/ data pribadi Pengguna kepada pihak ketiga lain, tanpa terdapat izin dari Pengguna, kecuali dalam hal-hal sebagai berikut:
                    </p>
                    <ul>
                        <li>
                        Terjadinya perubahan struktur kepemilikan perusahaan Kami termasuk namun tidak terbatas karena akuisisi atau penggabungan maka data pribadi Pengguna dapat dibuka, dan/atau beralih karena hukum, kepada perusahaan hasil penggabungan atau perusahaan yang melakukan akuisisi.
                        </li>
                        <li>
                        Adanya kewajiban hukum yang mensyaratkan Kami untuk membuka informasi Pengguna, termasuk namun tidak terbatas pada perintah pengadilan atau lembaga lainnya yang memiliki kewenangan yang sesuai.
                        </li>
                    </ul>
                </div>
                <div>
                    <h3 className='mt-5'>
                        Hak Kekayaan Intelektual
                    </h3>
                    <p className='font-size-14' style={{textAlign: 'justify'}}>
                        Hak Kekayaan Intelektual Kami telah terdaftar dan dilindungi oleh peraturan perundang-undangan yang terkait Hak Kekayaan Intelektual.
                    </p>
                </div>
                <div>
                    <h3 className='mt-5'>
                        Kritik dan Saran
                    </h3>
                    <p className='font-size-14' style={{textAlign: 'justify'}}>
                        Segala jenis kritik, masukan, atau saran dapat disampaikan melalui admin@myarchery.id
                    </p>
                </div>
            </div>
        </React.Fragment>
    )
}

export default PolicyArcher
