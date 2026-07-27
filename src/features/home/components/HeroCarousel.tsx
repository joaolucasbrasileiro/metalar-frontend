"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const autoPlayDelay = 5000;
const timerCircleRadius = 9;
const timerCircleCircumference = 2 * Math.PI * timerCircleRadius;

const slides = [
    {
        id: "1",
        image: "/banner-1.png",
        alt: "Tudo para construir do inicio ao fim",
        href: "/ofertas",
        backgroundColor: "#f4c400",
    },
    {
        id: "2",
        image: "/banner-2.png",
        alt: "Ofertas em materiais de construcao",
        href: "/caixas",
        backgroundColor: "#003f86",
    },
    {
        id: "3",
        image: "/banner-3.png",
        alt: "Ofertas em materiais de construcao",
        href: "/caixasss",
        backgroundColor: "#003f86",
    },
    {
        id: "4",
        image: "/banner-4.png",
        alt: "Ofertas em materiais de construcao",
        href: "/caixasssss",
        backgroundColor: "#d6cec2",
    },
];

export function HeroCarousel() {

    const [activeSlideIndex, setActiveSlideIndex] = useState(0);

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            setActiveSlideIndex((currentIndex) => {
                const isLastSlide = currentIndex === slides.length - 1;

                if (isLastSlide) {
                    return 0;
                }
                return currentIndex + 1;
            });
        }, autoPlayDelay);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [activeSlideIndex]);

    function goToNextSlide() {
        setActiveSlideIndex((currentIndex) => {
            const isLastSlide = currentIndex === slides.length - 1;

            if (isLastSlide) {
                return 0;
            }

            return currentIndex + 1;
        });
    }

    function goToPreviousSlide() {
        setActiveSlideIndex((currentIndex) => {
            const isFirstSlide = currentIndex === 0;

            if (isFirstSlide) {
                return slides.length - 1;
            }

            return currentIndex - 1;
        });
    }

    return (
        <section
            className="w-full transition-colors duration-500"
            style={{ backgroundColor: slides[activeSlideIndex].backgroundColor }}
        >
            <div className="group relative mx-auto h-[clamp(200px,26.0417vw,500px)] max-w-[1920px] bg-zinc-200">
                <div className="h-full overflow-hidden">
                    <div
                        className="flex h-full transition-transform duration-500 ease-in-out"
                        style={{
                            transform: `translateX(-${activeSlideIndex * 100}%)`,
                        }}
                    >
                        {slides.map((slide, index) => (
                            <a
                                key={slide.id}
                                href={slide.href}
                                className="relative h-full min-w-full"
                            >
                                <Image
                                    src={slide.image}
                                    alt={slide.alt}
                                    fill
                                    preload={index === 0}
                                    sizes="(min-width: 1920px) 1920px, 100vw"
                                    className="object-cover object-center"
                                />
                            </a>
                        ))}
                    </div>
                </div>

                <button
                    type="button"
                    onClick={goToPreviousSlide}
                    className="absolute 
                    cursor-pointer 
                    left-6 
                    top-1/2 
                    z-10 
                    grid 
                    h-10 
                    w-10 
                    -translate-y-1/2 
                    place-items-center 
                    rounded-full 
                    bg-white/80 
                    opacity-0 
                    shadow-sm 
                    transition-opacity 
                    duration-400 
                    group-hover:opacity-100 
                    text-xl 
                    text-zinc-900"
                >‹</button>

                <button
                    type="button"
                    onClick={goToNextSlide}
                    className="absolute 
                    cursor-pointer 
                    right-6 
                    top-1/2 
                    z-10 
                    grid 
                    h-10 
                    w-10 
                    -translate-y-1/2 
                    place-items-center 
                    rounded-full 
                    bg-white/80 
                    text-xl 
                    text-zinc-900 
                    opacity-0 
                    shadow-sm 
                    transition-opacity 
                    duration-400 
                    group-hover:opacity-100"
                >›</button>

                <div className="absolute bottom-0 left-1/2 z-20 flex -translate-x-1/2 translate-y-1/2 items-center gap-2 rounded-full bg-white px-3 py-1 shadow-md">
                    {slides.map((slide, index) => (
                        <button
                            key={slide.id}
                            type="button"
                            aria-label={`Ir para o banner ${index + 1}`}
                            onClick={() => setActiveSlideIndex(index)}
                            className="relative grid h-5 w-5 place-items-center rounded-full transition-colors"
                        >
                            <span
                                className={
                                    index === activeSlideIndex
                                        ? "h-2 w-2 rounded-full bg-[#FFD900]"
                                        : "h-2 w-2 rounded-full bg-zinc-400 transition-colors hover:bg-zinc-500"
                                }
                            />

                            {index === activeSlideIndex && (
                                <svg
                                    key={activeSlideIndex}
                                    aria-hidden="true"
                                    viewBox="0 0 24 24"
                                    className="pointer-events-none absolute inset-0 h-5 w-5 -rotate-90"
                                >
                                    <circle
                                        cx="12"
                                        cy="12"
                                        r={timerCircleRadius}
                                        fill="none"
                                        stroke="#FFD900"
                                        strokeWidth="2"
                                        strokeDasharray={timerCircleCircumference}
                                        strokeDashoffset={timerCircleCircumference}
                                        className="animate-carousel-timer"
                                    />
                                </svg>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}
