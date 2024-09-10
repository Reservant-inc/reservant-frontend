import { useState } from "react"
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import AdjustOutlinedIcon from '@mui/icons-material/AdjustOutlined';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import "./Carousel.css"
import React from "react";
import { getImage } from "../../../services/APIconn";
import DefaultImage from '../../../assets/images/no-image.png'

type CarouselProps = {
  images: string[]
}

const Carousel: React.FC<CarouselProps> = ({ images }) => {
  const [imageIndex, setImageIndex] = useState(0)

  function showNextImage() {
    setImageIndex(index => {
      if (index === images.length - 1) return 0
      return index + 1
    })
  }

  function showPrevImage() {
    setImageIndex(index => {
      if (index === 0) return images.length - 1
      return index - 1
    })
  }

  return (
    <section
      className="h-full w-full relative rounded-lg"
    >
      {
        images.length === 0 ? (
          <>No images</>
        ) : (
          <>
              <div
              className="w-full h-full flex overflow-hidden rounded-lg"
              >
                {images.map((image, index) => (
                  <img
                    key={image}
                    src={getImage(image, DefaultImage)}
                    aria-hidden={imageIndex !== index}
                    className="img-slider-img"
                    style={{ translate: `${-100 * imageIndex}%` }}
                  />
                ))}
              </div>
              <button
                onClick={showPrevImage}
                className="img-slider-btn top-1/2 left-2 p-2 rounded-full bg-white dark:bg-black dark:bg-opacity-60 bg-opacity-90 flex justify-center items-center"
              >
                <ArrowBackIosNewRoundedIcon className="dark:text-white w-5 h-5" />
              </button>
              <button
                onClick={showNextImage}
                className="img-slider-btn top-1/2 right-2 p-2 rounded-full bg-white dark:bg-black dark:bg-opacity-60 bg-opacity-90 flex justify-center items-center"
              >
                <ArrowForwardIosRoundedIcon className="dark:text-white w-5 h-5" />
              </button>
              <div
                className="absolute bottom-2 flex justify-center w-full h-10 items-center"
              >
                {images.map((_, index) => (
                  <button
                    key={index}
                    className="img-slider-dot-btn"
                    onClick={() => setImageIndex(index)}
                  >
                    {index === imageIndex ? (
                        <AdjustOutlinedIcon className="text-white h-6 w-6"/>
                    ) : (
                        <CircleOutlinedIcon className="text-white h-5 w-5"/>
                    )}
                  </button>
                ))}
              </div>
            <div id="after-image-slider-controls" />
          </>
        )
      }
    </section>
  )
}

export default Carousel