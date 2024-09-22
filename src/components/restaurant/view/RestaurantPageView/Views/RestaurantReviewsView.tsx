import React from "react";
import { useTranslation } from "react-i18next";

const RestaurantReviewsView = () => {
  const { t } = useTranslation("global");

  return <div>{t('reviews.ratings')}</div>;
};

export default RestaurantReviewsView;
