import React, { useEffect, useRef } from 'react'
import { CollectionShell } from './CollectionShell'
import { author } from '../data/authorData'
import '../authorStyles.css'

export function AboutPage() {
  const contactRef = useRef(null)
  useEffect(() => {
    if (window.location.hash === '#kontakt') contactRef.current?.scrollIntoView({ behavior: 'instant' })
  }, [])
  return <CollectionShell section="o-mnie" className="cz-galleries cz-about">
    <section className="cz-about-intro" aria-labelledby="about-title">
      <div className="cz-about-copy"><p className="cz-author-eyebrow">Cinek Zielu / O mnie</p><h1 id="about-title">Marcin<br /><span>Zieliński</span></h1><p className="cz-about-opening">Chodzę po górach, fotografuję i kręcę filmy.</p><p>Na tej stronie zbieram zdjęcia i filmy z moich wyjazdów. Są tu zimowe wejścia w Tatrach, alpejskie krajobrazy i podróże poza góry.</p><p>Czasem powstaje dłuższy film, czasem kilka fotografii. Tutaj można obejrzeć je w jednym miejscu.</p><div className="cz-about-links"><a href="/fotografia">Zobacz fotografie ↗</a><a href="/filmy">Obejrzyj filmy ↗</a></div></div>
      <div className="cz-about-portrait"><img src="/images/optimized/hero-720.webp" srcSet="/images/optimized/hero-720.webp 720w, /images/optimized/hero-1280.webp 1280w" sizes="(max-width:760px) calc(100vw - 28px), (max-width:1448px) 42vw, 580px" width="1760" height="2048" alt="Marcin Zieliński na górskim szczycie" fetchPriority="high" decoding="async" /></div>
    </section>
    <section ref={contactRef} id="kontakt" className="cz-contact" aria-labelledby="contact-title">
      <div><p className="cz-author-eyebrow">Porozmawiajmy</p><h2 id="contact-title">Kontakt</h2><p>Masz pytanie o zdjęcie, film albo pomysł na wspólny projekt? Napisz.</p></div>
      <div className="cz-contact-details"><a className="cz-contact-email" href={`mailto:${author.email}`}>{author.email}<span aria-hidden="true">↗</span></a><nav aria-label="Profile Cinek Zielu" className="cz-contact-socials">{author.socials.map(social => <a key={social.label} href={social.href} target="_blank" rel="noreferrer">{social.label} ↗</a>)}</nav></div>
    </section>
  </CollectionShell>
}
