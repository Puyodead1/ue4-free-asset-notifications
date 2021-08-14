import {
  CategoryObject,
  ImageObject,
  PlatformObject,
  ReleaseObject,
  ResourceObject,
  ResourceStatus,
  SellerObject,
} from "../Interfaces";

export default class Resource {
  id: string;
  catalogItemId: string;
  namespace: string;
  title: string;
  recurrence: string;
  currencyCode: string;
  priceValue: number;
  keyImages: ImageObject[];
  effectiveDate: Date;
  seller: SellerObject;
  description: string;
  technicalDetails: string;
  longDescription: string;
  isFeatured: boolean;
  isCatalogItem: boolean;
  categories: CategoryObject[];
  bundle: false;
  releaseInfo: ReleaseObject[];
  platforms: PlatformObject[];
  compatibleApps: string[];
  urlSlug: string;
  purchaseLimit: number;
  tax: number;
  tags: number[];
  commentRatingId: string;
  ratingId: string;
  klass: string;
  isNew: boolean;
  free: boolean;
  discounted: boolean;
  featured: string;
  thumbnail: string;
  learnThumbnail: string;
  headerImage: string;
  status: ResourceStatus;
  ownedCount: number;
  canPurchase: boolean;
  owned: boolean;
  price: string;
  discount?: string | null;
  discountPrice?: string | null;
  reviewed: boolean;
  /**
   * Creates a new Resource instance
   * @param data Raw API JSON response
   */
  constructor(data: ResourceObject) {
    this.id = data.id;
    this.catalogItemId = data.catalogItemId;
    this.namespace = data.namespace;
    this.title = data.title;
    this.recurrence = data.recurrence;
    this.currencyCode = data.currencyCode;
    this.priceValue = data.priceValue;
    this.keyImages = data.keyImages;
    this.effectiveDate = new Date(data.effectiveDate);
    this.seller = data.seller;
    this.description = data.description;
    this.technicalDetails = data.technicalDetails;
    this.longDescription = data.longDescription;
    this.isFeatured = data.isFeatured;
    this.isCatalogItem = data.isCatalogItem;
    this.categories = data.categories;
    this.bundle = data.bundle;
    this.releaseInfo = data.releaseInfo;
    this.platforms = data.platforms;
    this.compatibleApps = data.compatibleApps;
    this.urlSlug = data.urlSlug;
    this.purchaseLimit = data.purchaseLimit;
    this.tax = data.tax;
    this.tags = data.tags;
    this.commentRatingId = data.commentRatingId;
    this.ratingId = data.ratingId;
    this.klass = data.klass;
    this.isNew = data.isNew;
    this.free = data.free;
    this.discounted = data.discounted;
    this.featured = data.featured;
    this.thumbnail = data.thumbnail;
    this.learnThumbnail = data.learnThumbnail;
    this.headerImage = data.headerImage;
    this.status = data.status;
    this.ownedCount = data.ownedCount;
    this.canPurchase = data.canPurchase;
    this.owned = data.owned;
    this.price = data.price;
    this.discount = data.discount;
    this.discountPrice = data.discountPrice;
    this.reviewed = data.reviewed;
  }
}
