import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { DbArticle } from '../types';
import {
  fetchArticles,
  createArticle,
  updateArticle,
  deleteArticle,
} from '../services/adminDataService';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';
import {
  BookOpen,
  Search,
  Plus,
  Edit3,
  Trash2,
  Eye,
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Tag,
  ExternalLink,
  Image as ImageIcon,
  Check,
  X,
  RefreshCw,
  Sparkles,
  Upload,
  Crop,
  Sliders,
  ZoomIn,
  RotateCcw,
  Move,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface AdminArticlesProps {
  onBackToOverview?: () => void;
}

// Helper: Convert natural plain text with double newlines into clean HTML paragraphs
const rawTextToHtml = (text: string): string => {
  if (!text) return '';
  const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
  // If user already typed explicit HTML tags, preserve it
  if (/<(p|div|h[1-6]|ul|ol|blockquote)[\s>]/i.test(normalized)) {
    return normalized;
  }

  const blocks = normalized.split(/\n\s*\n+/);
  return blocks
    .map((b) => b.trim())
    .filter(Boolean)
    .map((b) => {
      if (b.startsWith('### ')) return `<h3>${b.slice(4).trim()}</h3>`;
      if (b.startsWith('## ')) return `<h2>${b.slice(3).trim()}</h2>`;
      if (b.startsWith('# ')) return `<h1>${b.slice(2).trim()}</h1>`;
      const withBr = b.replace(/\n/g, '<br/>');
      return `<p>${withBr}</p>`;
    })
    .join('\n\n');
};

// Helper: Convert HTML to plain text so user edits natural sentences without HTML tags
const htmlToRawText = (html: string): string => {
  if (!html) return '';
  let text = html;
  text = text.replace(/<\/p>\s*<p>/gi, '\n\n');
  text = text.replace(/<p>/gi, '');
  text = text.replace(/<\/p>/gi, '\n\n');
  text = text.replace(/<br\s*\/?>/gi, '\n');
  text = text.replace(/<h3>(.*?)<\/h3>/gi, '### $1\n\n');
  text = text.replace(/<h2>(.*?)<\/h2>/gi, '## $1\n\n');
  text = text.replace(/<h1>(.*?)<\/h1>/gi, '# $1\n\n');
  return text.trim();
};

// Helper: Normalize Google Drive and web image links
const normalizeImageUrl = (url: string): string => {
  if (!url) return '';
  const gDriveMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (gDriveMatch && gDriveMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${gDriveMatch[1]}`;
  }
  const gDriveIdMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (gDriveIdMatch && gDriveIdMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${gDriveIdMatch[1]}`;
  }
  return url;
};

// Helper: Get today's ISO date string (YYYY-MM-DD) in local time
export const getTodayDateString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const DEFAULT_CATEGORIES = [
  'Education',
  'Technology',
  'Leadership',
  'Community',
  'Sustainability',
  'Innovation',
  'Careers',
  'Digital Transformation',
  'Youth Empowerment',
];

const DEFAULT_TAGS = [
  'Technology',
  'Education',
  'Leadership',
  'Mentorship',
  'Youth Empowerment',
  'Innovation',
  'Community',
  'Sustainability',
  'Careers',
  'Digital Future',
  'Skill Development',
  'Global Impact',
];

interface DirectImageFramingSelectorProps {
  imageUrl: string;
  initialPosY?: number;
  initialPosX?: number;
  onPositionChange: (posY: number, posX: number, croppedDataUrl: string) => void;
}

const DirectImageFramingSelector: React.FC<DirectImageFramingSelectorProps> = ({
  imageUrl,
  initialPosY = 50,
  initialPosX = 50,
  onPositionChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [posY, setPosY] = useState<number>(initialPosY);
  const [posX, setPosX] = useState<number>(initialPosX);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [boxDimensions, setBoxDimensions] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
    maxShiftY: number;
    maxShiftX: number;
    isVerticalDrag: boolean;
  } | null>(null);
  const [croppedCardUrl, setCroppedCardUrl] = useState<string>('');

  const dragStartRef = useRef<{ clientX: number; clientY: number; startY: number; startX: number }>({
    clientX: 0,
    clientY: 0,
    startY: 50,
    startX: 50,
  });

  const computeGeometry = useCallback(() => {
    if (!containerRef.current || !imgRef.current) return;
    const cont = containerRef.current.getBoundingClientRect();
    const img = imgRef.current.getBoundingClientRect();

    if (img.width === 0 || img.height === 0) return;

    const targetRatio = 16 / 9;
    const imgRatio = img.width / img.height;
    const imgLeft = img.left - cont.left;
    const imgTop = img.top - cont.top;

    let bWidth: number;
    let bHeight: number;
    let maxShiftY = 0;
    let maxShiftX = 0;
    let isVerticalDrag = false;

    if (imgRatio < targetRatio) {
      // Image is taller or square - height is constrained, box moves vertically
      isVerticalDrag = true;
      bWidth = img.width;
      bHeight = Math.max(10, bWidth / targetRatio);
      maxShiftY = Math.max(0, img.height - bHeight);
    } else {
      // Image is wider than 16:9 - width is constrained, box moves horizontally
      isVerticalDrag = false;
      bHeight = img.height;
      bWidth = Math.max(10, bHeight * targetRatio);
      maxShiftX = Math.max(0, img.width - bWidth);
    }

    const currentTop = imgTop + (maxShiftY > 0 ? (posY / 100) * maxShiftY : 0);
    const currentLeft = imgLeft + (maxShiftX > 0 ? (posX / 100) * maxShiftX : 0);

    setBoxDimensions({
      top: currentTop,
      left: currentLeft,
      width: bWidth,
      height: bHeight,
      maxShiftY,
      maxShiftX,
      isVerticalDrag,
    });
  }, [posY, posX]);

  const generateCanvasCrop = useCallback(
    (curY: number, curX: number) => {
      if (!imageUrl) return;
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const targetAspect = 16 / 9;
        const imgAspect = img.naturalWidth / img.naturalHeight;
        const targetWidth = Math.min(Math.max(img.naturalWidth, 1200), 1920);
        const targetHeight = Math.round(targetWidth / targetAspect);

        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let srcW: number;
        let srcH: number;

        if (imgAspect > targetAspect) {
          srcH = img.naturalHeight;
          srcW = srcH * targetAspect;
        } else {
          srcW = img.naturalWidth;
          srcH = srcW / targetAspect;
        }

        const maxOffsetX = Math.max(0, img.naturalWidth - srcW);
        const maxOffsetY = Math.max(0, img.naturalHeight - srcH);

        const srcX = Math.max(0, Math.min(maxOffsetX, (curX / 100) * maxOffsetX));
        const srcY = Math.max(0, Math.min(maxOffsetY, (curY / 100) * maxOffsetY));

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, targetWidth, targetHeight);

        try {
          const cropped = canvas.toDataURL('image/jpeg', 0.90);
          setCroppedCardUrl(cropped);
          onPositionChange(curY, curX, cropped);
        } catch (err) {
          console.warn('Canvas export note:', err);
          onPositionChange(curY, curX, imageUrl);
        }
      };
      img.src = imageUrl;
    },
    [imageUrl, onPositionChange]
  );

  useEffect(() => {
    computeGeometry();
  }, [computeGeometry, imageUrl]);

  useEffect(() => {
    generateCanvasCrop(posY, posX);
  }, [imageUrl]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      startY: posY,
      startX: posX,
    };
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;
    setIsDragging(true);
    dragStartRef.current = {
      clientX: touch.clientX,
      clientY: touch.clientY,
      startY: posY,
      startX: posX,
    };
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!boxDimensions) return;
      if (boxDimensions.isVerticalDrag && boxDimensions.maxShiftY > 0) {
        const deltaY = e.clientY - dragStartRef.current.clientY;
        const newY = Math.max(
          0,
          Math.min(100, dragStartRef.current.startY + (deltaY / boxDimensions.maxShiftY) * 100)
        );
        setPosY(Math.round(newY));
      } else if (!boxDimensions.isVerticalDrag && boxDimensions.maxShiftX > 0) {
        const deltaX = e.clientX - dragStartRef.current.clientX;
        const newX = Math.max(
          0,
          Math.min(100, dragStartRef.current.startX + (deltaX / boxDimensions.maxShiftX) * 100)
        );
        setPosX(Math.round(newX));
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch || !boxDimensions) return;
      if (boxDimensions.isVerticalDrag && boxDimensions.maxShiftY > 0) {
        const deltaY = touch.clientY - dragStartRef.current.clientY;
        const newY = Math.max(
          0,
          Math.min(100, dragStartRef.current.startY + (deltaY / boxDimensions.maxShiftY) * 100)
        );
        setPosY(Math.round(newY));
      } else if (!boxDimensions.isVerticalDrag && boxDimensions.maxShiftX > 0) {
        const deltaX = touch.clientX - dragStartRef.current.clientX;
        const newX = Math.max(
          0,
          Math.min(100, dragStartRef.current.startX + (deltaX / boxDimensions.maxShiftX) * 100)
        );
        setPosX(Math.round(newX));
      }
    };

    const handleEnd = () => {
      setIsDragging(false);
      generateCanvasCrop(posY, posX);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, boxDimensions, posY, posX, generateCanvasCrop]);

  const setPreset = (targetY: number, targetX: number = 50) => {
    setPosY(targetY);
    setPosX(targetX);
    generateCanvasCrop(targetY, targetX);
  };

  return (
    <div className="space-y-3 pt-1">
      {/* Quick Focus Preset Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1 sm:gap-1.5">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted-foreground mr-1">
            Focus:
          </span>
          <button
            type="button"
            onClick={() => setPreset(0, 50)}
            className={`px-2 sm:px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-semibold border transition-colors ${
              posY <= 15
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card text-foreground border-border hover:bg-muted'
            }`}
          >
            Top
          </button>
          <button
            type="button"
            onClick={() => setPreset(50, 50)}
            className={`px-2 sm:px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-semibold border transition-colors ${
              posY > 15 && posY < 85
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card text-foreground border-border hover:bg-muted'
            }`}
          >
            Center
          </button>
          <button
            type="button"
            onClick={() => setPreset(100, 50)}
            className={`px-2 sm:px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-semibold border transition-colors ${
              posY >= 85
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card text-foreground border-border hover:bg-muted'
            }`}
          >
            Bottom
          </button>
        </div>

        <span className="text-[10px] sm:text-[11px] text-muted-foreground font-mono hidden sm:inline">
          Drag dashed box directly over image to choose card crop
        </span>
      </div>

      {/* Main Drag-to-Select Viewport & Live Card Preview side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Complete Image Container with Dashed 16:9 Window */}
        <div
          ref={containerRef}
          className="lg:col-span-2 relative w-full h-[220px] sm:h-[330px] bg-neutral-950/95 rounded-2xl overflow-hidden flex items-center justify-center select-none border border-border shadow-inner"
        >
          <img
            ref={imgRef}
            src={imageUrl}
            alt="Full Uploaded Artwork"
            onLoad={computeGeometry}
            className="max-h-[220px] sm:max-h-[330px] w-auto max-w-full object-contain pointer-events-none select-none block mx-auto"
          />

          {/* Draggable 16:9 Dashed Window with Outer Dark Mask */}
          {boxDimensions && (
            <div
              style={{
                position: 'absolute',
                top: `${boxDimensions.top}px`,
                left: `${boxDimensions.left}px`,
                width: `${boxDimensions.width}px`,
                height: `${boxDimensions.height}px`,
                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.55)',
                border: '2px dashed rgba(255, 255, 255, 0.95)',
                cursor: isDragging ? 'grabbing' : 'grab',
                touchAction: 'none',
              }}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              className="group/crop transition-shadow"
            >
              {/* Corner Viewfinder Indicators */}
              <span className="absolute -top-1 -left-1 w-2.5 h-2.5 sm:w-3 sm:h-3 border-t-2 border-l-2 border-white pointer-events-none" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 border-t-2 border-r-2 border-white pointer-events-none" />
              <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 sm:w-3 sm:h-3 border-b-2 border-l-2 border-white pointer-events-none" />
              <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 border-b-2 border-r-2 border-white pointer-events-none" />

              {/* Center Grab Handle Pill */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-md px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-white/20 text-white text-[9px] sm:text-[11px] font-bold flex items-center gap-1 sm:gap-1.5 shadow-xl pointer-events-none whitespace-nowrap">
                <Move className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-emerald-400" />
                <span>16:9 Crop (Drag)</span>
              </div>
            </div>
          )}
        </div>

        {/* Live 16:9 Card Thumbnail Preview */}
        <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-3.5 space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                Card Thumbnail (16:9)
              </span>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                Live Card Look
              </span>
            </div>

            <div className="w-full aspect-video rounded-xl overflow-hidden bg-muted border border-border shadow-xs relative">
              <img
                src={croppedCardUrl || imageUrl}
                alt="Selected Card View"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="space-y-1 text-[11px] text-muted-foreground bg-muted/30 p-2.5 rounded-xl border border-border/60">
            <p className="font-semibold text-foreground">
              ✓ Exact card framing:
            </p>
            <p className="leading-snug">
              This 16:9 thumbnail is what visitors see in the card grid. When they open the article, the <strong className="text-foreground">complete, uncropped image</strong> is displayed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AdminArticles: React.FC<AdminArticlesProps> = ({ onBackToOverview }) => {
  const [articles, setArticles] = useState<DbArticle[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modal states
  const [inspectArticle, setInspectArticle] = useState<DbArticle | null>(null);
  const [editingArticle, setEditingArticle] = useState<DbArticle | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);
  const [articleToDelete, setArticleToDelete] = useState<DbArticle | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Modal view tab: 'edit' | 'preview'
  const [modalActiveTab, setModalActiveTab] = useState<'edit' | 'preview'>('edit');

  // File upload state & ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadFileName, setUploadFileName] = useState<string | null>(null);

  // Form fields for create/edit - ALL EMPTY BY DEFAULT
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: '',
    category: '',
    read_time: '',
    image: '',
    card_image: '',
    tags: '',
    published_date: '',
  });

  // Dynamic Category state: selectable with "Other..." option
  const [selectedCategoryOption, setSelectedCategoryOption] = useState<string>('');
  const [customCategory, setCustomCategory] = useState<string>('');

  // Read Time state: strictly natural integer (e.g. 5)
  const [readTimeNumber, setReadTimeNumber] = useState<string>('');

  // Tags state: checkboxes with "Other..." option
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dynamicTags, setDynamicTags] = useState<string[]>([]);
  const [isAddingCustomTag, setIsAddingCustomTag] = useState<boolean>(false);
  const [customTagInput, setCustomTagInput] = useState<string>('');

  // Image sizing & framing adjustment state
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
    fileSize?: string;
  } | null>(null);
  const [originalRawImage, setOriginalRawImage] = useState<string | null>(null);
  const [isAdjustingImage, setIsAdjustingImage] = useState<boolean>(false);
  const [cropPositionY, setCropPositionY] = useState<number>(50); // 0 (top) to 100 (bottom)
  const [cropPositionX, setCropPositionX] = useState<number>(50); // 0 (left) to 100 (right)
  const [cropZoom, setCropZoom] = useState<number>(1.0); // 1.0 to 2.5

  const inspectImageDimensions = (url: string, size?: string) => {
    if (!url) {
      setImageDimensions(null);
      return;
    }
    const img = new Image();
    img.onload = () => {
      setImageDimensions({
        width: img.naturalWidth,
        height: img.naturalHeight,
        fileSize: size,
      });
    };
    img.onerror = () => {
      setImageDimensions(null);
    };
    img.src = url;
  };

  // HTML5 Canvas 16:9 Framing / Crop Generator
  const apply16x9Framing = () => {
    const source = originalRawImage || formData.image;
    if (!source) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const targetAspect = 16 / 9;
      const imgAspect = img.naturalWidth / img.naturalHeight;

      // High-res target canvas resolution
      const targetWidth = Math.min(Math.max(img.naturalWidth, 1200), 1920);
      const targetHeight = Math.round(targetWidth / targetAspect);

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let srcW: number;
      let srcH: number;

      if (imgAspect > targetAspect) {
        srcH = img.naturalHeight / cropZoom;
        srcW = srcH * targetAspect;
      } else {
        srcW = img.naturalWidth / cropZoom;
        srcH = srcW / targetAspect;
      }

      const maxOffsetX = img.naturalWidth - srcW;
      const maxOffsetY = img.naturalHeight - srcH;

      const srcX = Math.max(0, Math.min(maxOffsetX, (cropPositionX / 100) * maxOffsetX));
      const srcY = Math.max(0, Math.min(maxOffsetY, (cropPositionY / 100) * maxOffsetY));

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, targetWidth, targetHeight);

      try {
        const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.92);
        setFormData((prev) => ({ ...prev, image: croppedDataUrl }));
        setImageDimensions({
          width: targetWidth,
          height: targetHeight,
          fileSize: imageDimensions?.fileSize,
        });
        setIsAdjustingImage(false);
        toast.success('16:9 framing applied to cover image!');
      } catch (err) {
        console.warn('Canvas export notice:', err);
        setIsAdjustingImage(false);
        toast.success('Framing settings applied!');
      }
    };
    img.onerror = () => {
      toast.error('Could not process image for framing');
    };
    img.src = source;
  };

  const loadData = async () => {
    setIsLoading(true);
    const res = await fetchArticles();
    setArticles(res.data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Generate dynamic unique categories list from articles + defaults
  const availableCategories = useMemo(() => {
    const set = new Set<string>(DEFAULT_CATEGORIES);
    articles.forEach((a) => {
      if (a.category && a.category.trim()) set.add(a.category.trim());
    });
    return Array.from(set);
  }, [articles]);

  // Categories list for the top filter bar
  const categories = useMemo(() => {
    const set = new Set<string>();
    articles.forEach((a) => {
      if (a.category && a.category.trim()) set.add(a.category.trim());
    });
    return Array.from(set);
  }, [articles]);

  // Generate dynamic unique tags list from articles + defaults + session custom tags
  const allAvailableTags = useMemo(() => {
    const set = new Set<string>(DEFAULT_TAGS);
    articles.forEach((a) => {
      if (Array.isArray(a.tags)) {
        a.tags.forEach((t) => {
          if (t && t.trim()) set.add(t.trim());
        });
      }
    });
    dynamicTags.forEach((t) => {
      if (t && t.trim()) set.add(t.trim());
    });
    return Array.from(set);
  }, [articles, dynamicTags]);

  // Filtered articles
  const filteredArticles = useMemo(() => {
    return articles.filter((a) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        a.title.toLowerCase().includes(q) ||
        (a.excerpt && a.excerpt.toLowerCase().includes(q)) ||
        (a.author && a.author.toLowerCase().includes(q)) ||
        (a.category && a.category.toLowerCase().includes(q)) ||
        (a.tags && a.tags.some((t) => t.toLowerCase().includes(q)));

      const matchCategory =
        selectedCategory === 'all' ||
        (a.category && a.category.toLowerCase() === selectedCategory.toLowerCase());

      return matchSearch && matchCategory;
    });
  }, [articles, searchQuery, selectedCategory]);

  // Handle opening Create modal - ALL FIELDS MUST BE EMPTY
  const openCreateModal = () => {
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      author: '',
      category: '',
      read_time: '',
      image: '',
      card_image: '',
      tags: '',
      published_date: getTodayDateString(),
    });
    setSelectedCategoryOption('');
    setCustomCategory('');
    setReadTimeNumber('');
    setSelectedTags([]);
    setIsAddingCustomTag(false);
    setCustomTagInput('');
    setUploadFileName(null);
    setImageDimensions(null);
    setOriginalRawImage(null);
    setIsAdjustingImage(false);
    setCropPositionY(50);
    setCropPositionX(50);
    setCropZoom(1.0);
    setEditingArticle(null);
    setModalActiveTab('edit');
    setIsCreatingNew(true);
  };

  // Handle opening Edit modal - populate category, read time integer, tags checkboxes
  const openEditModal = (article: DbArticle) => {
    setFormData({
      title: article.title || '',
      slug: article.slug || '',
      excerpt: article.excerpt || '',
      content: htmlToRawText(article.content || ''),
      author: article.author || '',
      category: article.category || '',
      read_time: article.read_time || '',
      image: article.image || '',
      card_image: article.card_image || article.image || '',
      tags: Array.isArray(article.tags) ? article.tags.join(', ') : '',
      published_date: article.published_date || '',
    });

    // Category
    const cat = article.category || '';
    if (cat && availableCategories.includes(cat)) {
      setSelectedCategoryOption(cat);
      setCustomCategory('');
    } else if (cat) {
      setSelectedCategoryOption('__other__');
      setCustomCategory(cat);
    } else {
      setSelectedCategoryOption('');
      setCustomCategory('');
    }

    // Read Time natural integer
    const minutes = parseInt(String(article.read_time || '5').replace(/\D/g, ''), 10) || 5;
    setReadTimeNumber(String(minutes));

    // Tags checkboxes
    const tagsArr = Array.isArray(article.tags) ? article.tags : [];
    setSelectedTags(tagsArr);
    tagsArr.forEach((t) => {
      if (!allAvailableTags.includes(t)) {
        setDynamicTags((prev) => [...prev, t]);
      }
    });

    // Image inspection
    if (article.image) {
      inspectImageDimensions(article.image);
      setOriginalRawImage(article.image);
    } else {
      setImageDimensions(null);
      setOriginalRawImage(null);
    }

    setIsAdjustingImage(false);
    setCropPositionY(50);
    setCropPositionX(50);
    setCropZoom(1.0);
    setIsAddingCustomTag(false);
    setCustomTagInput('');
    setUploadFileName(null);
    setEditingArticle(article);
    setModalActiveTab('edit');
    setIsCreatingNew(false);
  };

  // Toggle tag in checkbox list
  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Add custom tag from "Other..."
  const handleAddCustomTag = () => {
    const clean = customTagInput.trim().replace(/^#+/, '');
    if (!clean) return;
    if (!dynamicTags.includes(clean)) {
      setDynamicTags((prev) => [...prev, clean]);
    }
    if (!selectedTags.includes(clean)) {
      setSelectedTags((prev) => [...prev, clean]);
    }
    setCustomTagInput('');
    setIsAddingCustomTag(false);
  };

  // Computed effective category
  const effectiveCategory =
    selectedCategoryOption === '__other__'
      ? customCategory.trim()
      : selectedCategoryOption.trim();

  // Handle Computer File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (PNG, JPG, WebP, etc.)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be under 5MB');
      return;
    }

    const fileSizeStr = (file.size / (1024 * 1024)).toFixed(2) + ' MB';

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const dataUrl = loadEvent.target?.result as string;
      setFormData((prev) => ({ ...prev, image: dataUrl, card_image: dataUrl }));
      setOriginalRawImage(dataUrl);
      setUploadFileName(file.name);
      inspectImageDimensions(dataUrl, fileSizeStr);
      setCropPositionY(50);
      setCropPositionX(50);
      setCropZoom(1.0);
      toast.success(`Image "${file.name}" loaded (${fileSizeStr})`);
    };
    reader.readAsDataURL(file);
  };

  // Auto-slug generator when title changes (if creating new)
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    if (isCreatingNew) {
      const generatedSlug = newTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setFormData((prev) => ({ ...prev, title: newTitle, slug: generatedSlug }));
    } else {
      setFormData((prev) => ({ ...prev, title: newTitle }));
    }
  };

  // Save form handler (Create or Update)
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.slug.trim() || !formData.content.trim()) {
      toast.error('Please fill in the article title, slug, and story content.');
      return;
    }

    if (!effectiveCategory) {
      toast.error('Please select or specify a category for the article.');
      return;
    }

    const naturalMinutes = Math.max(1, parseInt(readTimeNumber, 10) || 5);
    const finalReadTime = `${naturalMinutes} min read`;
    const finalTags = selectedTags;

    setIsSaving(true);
    const formattedHtmlContent = rawTextToHtml(formData.content);
    const finalAuthor = formData.author.trim() || 'Pranav Gujar';
    const todayStr = getTodayDateString();
    const finalDate = formData.published_date.trim() || todayStr;

    // Strictly disallow future published dates
    if (finalDate > todayStr) {
      toast.error('Published date cannot be in the future. Please choose today or a past date.');
      setIsSaving(false);
      return;
    }

    const finalImage = normalizeImageUrl(formData.image.trim()) || 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800';
    const finalCardImage = formData.card_image || finalImage;

    try {
      if (isCreatingNew) {
        const res = await createArticle({
          title: formData.title.trim(),
          slug: formData.slug.trim(),
          excerpt: formData.excerpt.trim(),
          content: formattedHtmlContent,
          author: finalAuthor,
          category: effectiveCategory,
          read_time: finalReadTime,
          image: finalImage,
          card_image: finalCardImage,
          tags: finalTags,
          published_date: finalDate,
        });

        if (res.success && res.data) {
          setArticles((prev) => [res.data!, ...prev]);
          toast.success('Article published successfully!');
          setIsCreatingNew(false);
        } else {
          toast.error(res.error || 'Failed to create article');
        }
      } else if (editingArticle) {
        const res = await updateArticle(editingArticle.id, {
          title: formData.title.trim(),
          slug: formData.slug.trim(),
          excerpt: formData.excerpt.trim(),
          content: formattedHtmlContent,
          author: finalAuthor,
          category: effectiveCategory,
          read_time: finalReadTime,
          image: finalImage,
          card_image: finalCardImage,
          tags: finalTags,
          published_date: finalDate,
        });

        if (res.success && res.data) {
          setArticles((prev) =>
            prev.map((a) => (a.id === editingArticle.id ? res.data! : a))
          );
          if (inspectArticle?.id === editingArticle.id) {
            setInspectArticle(res.data);
          }
          toast.success('Article updated successfully!');
          setEditingArticle(null);
        } else {
          toast.error(res.error || 'Failed to update article');
        }
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Safe delete handler
  const confirmDeleteAction = async () => {
    if (!articleToDelete) return;
    setIsDeleting(true);
    try {
      const success = await deleteArticle(articleToDelete.id);
      if (success) {
        setArticles((prev) => prev.filter((a) => a.id !== articleToDelete.id));
        if (inspectArticle?.id === articleToDelete.id) {
          setInspectArticle(null);
        }
        toast.success('Article permanently deleted.');
      } else {
        toast.error('Failed to delete article');
      }
    } finally {
      setIsDeleting(false);
      setArticleToDelete(null);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in-50 duration-300">
      {/* Top Navigation Breadcrumb */}
      {onBackToOverview && (
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToOverview}
            className="group inline-flex items-center gap-2 rounded-xl border border-border/80 bg-card px-3.5 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-emerald-500/40 hover:bg-muted/50 transition-all shadow-xs admin-btn-press"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-1 text-emerald-500" />
            <span>Back to Dashboard</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <span>Executive Console</span>
            <span>/</span>
            <span className="text-foreground font-semibold">Articles &amp; Editorial</span>
          </div>
        </div>
      )}

      {/* Main Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-5 rounded-2xl sm:rounded-3xl border border-border/80 bg-card p-4 sm:p-6 shadow-sm">
        <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
          <div className="flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-xs flex-shrink-0">
            <BookOpen className="h-5 w-5 sm:h-7 sm:w-7" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg sm:text-2xl font-black tracking-tight text-foreground truncate">
              Articles &amp; Knowledge Hub
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 truncate">
              Manage articles, write stories, update publication tags, and edit content live.
            </p>
          </div>
        </div>

        {/* Stats & Actions */}
        <div className="flex items-center space-x-2.5 sm:space-x-3 self-start sm:self-center">
          <div className="rounded-xl sm:rounded-2xl border border-border/80 bg-muted/40 px-3 py-1.5 sm:px-4 sm:py-2 text-center shadow-xs">
            <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-muted-foreground font-bold block">
              Total
            </span>
            <p className="font-mono font-extrabold text-foreground text-sm sm:text-base mt-0.5">
              {articles.length}
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center space-x-1.5 sm:space-x-2 rounded-xl sm:rounded-2xl bg-primary px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs font-bold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 transition-all admin-btn-press flex-shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>New Article</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-3 rounded-xl sm:rounded-2xl border border-border/80 bg-card p-3 sm:p-4 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search articles by title, author, category, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border bg-input pl-9 pr-4 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none admin-input-smooth"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-xl border border-border bg-input px-3 py-1.5 sm:py-2 text-xs font-medium text-foreground focus:border-primary focus:outline-none admin-input-smooth"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <span className="rounded-xl border border-border bg-muted/40 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-mono font-semibold text-muted-foreground">
            {filteredArticles.length} {filteredArticles.length === 1 ? 'Article' : 'Articles'}
          </span>
        </div>
      </div>

      {/* Articles Grid Catalog */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm"
            >
              <div className="relative h-48 w-full bg-muted/70 overflow-hidden">
                <div className="absolute inset-0 animate-admin-shimmer" />
              </div>
              <div className="p-5 space-y-3">
                <div className="relative h-3.5 w-24 bg-muted rounded overflow-hidden">
                  <div className="absolute inset-0 animate-admin-shimmer" />
                </div>
                <div className="relative h-5 w-4/5 bg-muted rounded overflow-hidden">
                  <div className="absolute inset-0 animate-admin-shimmer" />
                </div>
                <div className="relative h-3.5 w-full bg-muted rounded overflow-hidden">
                  <div className="absolute inset-0 animate-admin-shimmer" />
                </div>
                <div className="relative h-3.5 w-2/3 bg-muted rounded overflow-hidden">
                  <div className="absolute inset-0 animate-admin-shimmer" />
                </div>
                <div className="pt-3 border-t border-border/70 flex justify-between items-center">
                  <div className="relative h-4 w-20 bg-muted rounded overflow-hidden">
                    <div className="absolute inset-0 animate-admin-shimmer" />
                  </div>
                  <div className="relative h-7 w-20 bg-muted rounded-lg overflow-hidden">
                    <div className="absolute inset-0 animate-admin-shimmer" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="rounded-3xl border border-border/80 bg-card p-12 text-center text-muted-foreground text-sm">
          <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="font-semibold text-foreground">No articles found</p>
          <p className="text-xs text-muted-foreground mt-1">
            {searchQuery || selectedCategory !== 'all'
              ? 'Try adjusting your search query or filters.'
              : 'Click "New Article" above to create and publish your first article.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article, idx) => {
            const staggerClass = `stagger-${(idx % 8) + 1}`;
            return (
              <div
                key={article.id}
                className={`group flex flex-col justify-between overflow-hidden rounded-2xl border-2 border-border/80 bg-card shadow-sm admin-card-hover animate-admin-card ${staggerClass} hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/10`}
              >
                {/* Cover Image & Category Badge */}
                <div className="relative h-48 w-full overflow-hidden bg-muted">
                  {article.image ? (
                    <img
                      src={article.image}
                      alt={article.title}
                      loading="lazy"
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                      <ImageIcon className="h-10 w-10 opacity-30" />
                    </div>
                  )}
                  <span className="absolute top-3 left-3 rounded-full bg-card/90 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-primary border border-border/70 shadow-xs">
                    {article.category || 'General'}
                  </span>
                  <span className="absolute top-3 right-3 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 text-[10px] font-mono font-medium text-white flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {article.read_time || '5 min'}
                  </span>
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-2 text-[11px] text-muted-foreground mb-2">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3 text-primary" />
                        {article.author || 'Pranav Gujar'}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {article.published_date || 'Recent'}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>

                    <p className="mt-2 text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>

                  {/* Tags & Action Bar */}
                  <div className="mt-4 pt-3 border-t border-border/70">
                    {article.tags && article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {article.tags.slice(0, 3).map((t, tagIdx) => (
                          <span
                            key={tagIdx}
                            className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground hover:bg-muted/80 transition-colors"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      {/* View Live Article Link */}
                      <a
                        href={`/articles/${article.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 text-[11px] font-medium text-muted-foreground hover:text-primary transition-colors admin-btn-press"
                        title="Preview on live website"
                      >
                        <span>Public Link</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>

                      {/* Actions: Inspect, Edit, Delete */}
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => setInspectArticle(article)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-primary hover:bg-muted transition-colors admin-btn-press"
                          title="Inspect Full Content"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => openEditModal(article)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 transition-colors admin-btn-press"
                          title="Edit Article"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setArticleToDelete(article)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors admin-btn-press"
                          title="Delete Article"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Slide-Over / Full Inspection Modal */}
      {inspectArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-admin-modal-backdrop">
          <div className="relative h-full max-h-[90vh] w-full max-w-3xl rounded-3xl border border-border bg-card shadow-2xl flex flex-col justify-between overflow-hidden animate-admin-modal-panel">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border p-5 bg-card/90">
              <div className="flex items-center space-x-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground line-clamp-1">
                    {inspectArticle.title}
                  </h3>
                  <p className="text-xs text-muted-foreground font-mono">
                    /articles/{inspectArticle.slug}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    openEditModal(inspectArticle);
                  }}
                  className="inline-flex items-center space-x-1.5 rounded-xl border border-border bg-muted/60 px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors admin-btn-press"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => setInspectArticle(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors admin-btn-press"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Modal Scrollable Article Content */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Cover Banner */}
              {inspectArticle.image && (
                <div className="relative h-64 w-full rounded-2xl overflow-hidden shadow-sm">
                  <img
                    src={inspectArticle.image}
                    alt={inspectArticle.title}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute bottom-3 left-3 rounded-full bg-black/70 backdrop-blur-md px-3 py-1 text-xs font-semibold text-white">
                    {inspectArticle.category}
                  </span>
                </div>
              )}

              {/* Metadata row */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground border-y border-border/70 py-3">
                <span className="flex items-center gap-1.5">
                  <User className="h-4 w-4 text-primary" />
                  <strong className="text-foreground">{inspectArticle.author}</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {inspectArticle.published_date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {inspectArticle.read_time}
                </span>
              </div>

              {/* Excerpt */}
              {inspectArticle.excerpt && (
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm font-medium text-foreground italic">
                  "{inspectArticle.excerpt}"
                </div>
              )}

              {/* Rendered HTML Content with Automatic Drop Cap */}
              <div className="blog-prose max-w-none text-left">
                <style>{`
                  .blog-prose p {
                    font-size: 1.125rem !important;
                    line-height: 1.85 !important;
                    color: var(--muted-foreground) !important;
                    margin-top: 0 !important;
                    margin-bottom: 1.75rem !important;
                    font-weight: 400 !important;
                  }
                  .blog-prose p:last-child {
                    margin-bottom: 0 !important;
                  }
                  .blog-prose > p:first-of-type::first-letter,
                  .blog-prose p:first-of-type::first-letter {
                    float: left !important;
                    font-size: 3.15rem !important;
                    line-height: 0.82 !important;
                    margin-top: 3px !important;
                    margin-right: 8px !important;
                    padding: 0 !important;
                    font-weight: 700 !important;
                    color: #6366f1 !important;
                    font-family: 'Georgia', 'Cambria', 'Times New Roman', serif !important;
                    text-transform: uppercase !important;
                  }
                `}</style>
                <div dangerouslySetInnerHTML={{ __html: inspectArticle.content }} />
              </div>

              {/* Tags */}
              {inspectArticle.tags && inspectArticle.tags.length > 0 && (
                <div className="pt-4 border-t border-border flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-wrap gap-1.5">
                    {inspectArticle.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="rounded-lg bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Actions */}
            <div className="border-t border-border p-4 bg-muted/20 flex items-center justify-between">
              <button
                onClick={() => {
                  setArticleToDelete(inspectArticle);
                }}
                className="inline-flex items-center space-x-1.5 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-500/20 transition-colors admin-btn-press"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete Article</span>
              </button>

              <button
                onClick={() => setInspectArticle(null)}
                className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors admin-btn-press"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Editor Modal (Create or Edit Article) */}
      {(isCreatingNew || editingArticle) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-4 animate-admin-modal-backdrop">
          <div className="relative h-full max-h-[96vh] sm:max-h-[94vh] w-full max-w-4xl rounded-2xl sm:rounded-3xl border border-border bg-card shadow-2xl flex flex-col justify-between overflow-hidden animate-admin-modal-panel">
            {/* Header with Editor / Live Preview Tab Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border p-3.5 sm:p-5 bg-card/90 gap-2.5 sm:gap-3">
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-primary/10 text-primary flex-shrink-0">
                  {isCreatingNew ? <Plus className="h-4 w-4 sm:h-5 sm:w-5" /> : <Edit3 className="h-4 w-4 sm:h-5 sm:w-5" />}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-foreground truncate">
                    {isCreatingNew ? 'Create New Article' : 'Edit Article Publication'}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-muted-foreground font-mono truncate">
                    {formData.slug ? `/articles/${formData.slug}` : 'Drafting publication'}
                  </p>
                </div>
              </div>

              {/* Tab Switcher: Editor vs Live Website Preview */}
              <div className="flex items-center space-x-1.5 sm:space-x-2 self-start sm:self-auto w-full sm:w-auto justify-between sm:justify-end">
                <div className="flex items-center space-x-1 rounded-xl bg-muted/60 p-1 border border-border">
                  <button
                    type="button"
                    onClick={() => setModalActiveTab('edit')}
                    className={`inline-flex items-center space-x-1 sm:space-x-1.5 rounded-lg px-2.5 sm:px-3 py-1.5 text-xs font-bold transition-all ${
                      modalActiveTab === 'edit'
                        ? 'bg-card text-foreground shadow-xs border border-border/80'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Edit3 className="h-3.5 w-3.5 flex-shrink-0" />
                    <span><span className="hidden sm:inline">Story </span>Editor</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalActiveTab('preview')}
                    className={`inline-flex items-center space-x-1 sm:space-x-1.5 rounded-lg px-2.5 sm:px-3 py-1.5 text-xs font-bold transition-all ${
                      modalActiveTab === 'preview'
                        ? 'bg-primary text-primary-foreground shadow-xs'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Eye className="h-3.5 w-3.5 flex-shrink-0" />
                    <span><span className="hidden sm:inline">Live </span>Preview</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingNew(false);
                    setEditingArticle(null);
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors admin-btn-press flex-shrink-0"
                  title="Close Modal"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* TAB 1: STORY EDITOR */}
            {modalActiveTab === 'edit' ? (
              <form id="article-form" onSubmit={handleFormSubmit} className="flex-1 p-3.5 sm:p-6 overflow-y-auto space-y-3.5 sm:space-y-4 text-xs sm:text-sm custom-scrollbar">
                {/* Title & Slug */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      Article Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={handleTitleChange}
                      placeholder="e.g. Transforming Youth with Technology Learning"
                      className="w-full rounded-xl border border-border bg-input px-3.5 py-2 text-foreground focus:border-primary focus:outline-none admin-input-smooth font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      URL Slug * (Unique)
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="e.g. transforming-youth-with-technology"
                      className="w-full rounded-xl border border-border bg-input px-3.5 py-2 font-mono text-foreground focus:border-primary focus:outline-none admin-input-smooth"
                    />
                  </div>
                </div>

                {/* Author, Category, Date & Read Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      Author
                    </label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      placeholder="e.g. Pranav Gujar"
                      className="w-full rounded-xl border border-border bg-input px-3 py-2 text-foreground focus:border-primary focus:outline-none admin-input-smooth"
                    />
                  </div>

                  {/* Category: Selectable with 'Other...' custom option */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      Category *
                    </label>
                    <select
                      required
                      value={selectedCategoryOption}
                      onChange={(e) => {
                        setSelectedCategoryOption(e.target.value);
                        if (e.target.value !== '__other__') {
                          setCustomCategory('');
                        }
                      }}
                      className="w-full rounded-xl border border-border bg-input px-3 py-2 text-foreground focus:border-primary focus:outline-none admin-input-smooth cursor-pointer font-medium"
                    >
                      <option value="" disabled>Select category...</option>
                      {availableCategories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                      <option value="__other__">+ Other (Type custom category...)</option>
                    </select>

                    {/* Custom Category Input if 'Other' selected */}
                    {selectedCategoryOption === '__other__' && (
                      <div className="mt-2 animate-in fade-in-50 duration-200">
                        <input
                          type="text"
                          required
                          autoFocus
                          value={customCategory}
                          onChange={(e) => setCustomCategory(e.target.value)}
                          placeholder="Type new category name..."
                          className="w-full rounded-xl border border-primary/50 bg-input px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none admin-input-smooth text-xs"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Published Date *
                      </label>
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, published_date: getTodayDateString() }))}
                        className="text-[10px] font-bold text-primary hover:underline cursor-pointer"
                        title="Set to today's date"
                      >
                        Set to Today
                      </button>
                    </div>
                    <input
                      type="date"
                      max={getTodayDateString()}
                      value={formData.published_date}
                      onChange={(e) => {
                        const val = e.target.value;
                        const today = getTodayDateString();
                        if (val && val > today) {
                          toast.error('Published date cannot be in the future. Clamped to today.');
                          setFormData({ ...formData, published_date: today });
                        } else {
                          setFormData({ ...formData, published_date: val });
                        }
                      }}
                      className="w-full rounded-xl border border-border bg-input px-3 py-2 text-foreground focus:border-primary focus:outline-none admin-input-smooth"
                    />
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      Must be today or a past date (future dates disallowed)
                    </p>
                  </div>

                  {/* Read Time: Valid natural number only */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      Read Time (in mins) *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        step="1"
                        required
                        value={readTimeNumber}
                        onKeyDown={(e) => {
                          // Strictly disallow floating point symbols or negative signs
                          if (['.', ',', 'e', 'E', '+', '-'].includes(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          setReadTimeNumber(val);
                        }}
                        placeholder="e.g. 5"
                        className="w-full rounded-xl border border-border bg-input pl-3 pr-16 py-2 text-foreground focus:border-primary focus:outline-none admin-input-smooth font-mono font-bold"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-muted-foreground pointer-events-none">
                        min read
                      </span>
                    </div>
                  </div>
                </div>

                {/* Cover Image & 16:9 Card Framing (Direct Drag-to-Select) */}
                <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 space-y-3.5 shadow-2xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/80 pb-3">
                    <div className="flex items-center space-x-2">
                      <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                        <ImageIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                          Cover Image &amp; Card View
                        </h4>
                        <p className="text-[11px] text-muted-foreground">
                          Upload complete graphic or photo, and drag the dashed box to select the 16:9 card thumbnail
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        16:9 Cards • Full Image on Open
                      </span>
                    </div>
                  </div>

                  {/* Hidden File Input for Device Upload */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />

                  {/* Upload Controls */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center justify-center space-x-2 rounded-xl border border-primary/30 bg-primary/10 px-4 py-2.5 text-xs font-bold text-primary hover:bg-primary/20 transition-colors admin-btn-press flex-shrink-0"
                    >
                      <Upload className="h-4 w-4" />
                      <span>Upload from Computer</span>
                    </button>

                    <div className="relative flex-1">
                      <input
                        type="url"
                        value={formData.image}
                        onChange={(e) => {
                          const normalized = normalizeImageUrl(e.target.value.trim());
                          setFormData({ ...formData, image: normalized, card_image: normalized });
                          inspectImageDimensions(normalized);
                          setUploadFileName(null);
                        }}
                        placeholder="Or paste direct image URL / Google Drive link..."
                        className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-foreground focus:border-primary focus:outline-none admin-input-smooth text-xs"
                      />
                    </div>

                    {formData.image && (
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, image: '', card_image: '' });
                          setImageDimensions(null);
                          setUploadFileName(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="inline-flex items-center justify-center gap-1 rounded-xl px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-500/10 hover:text-red-600 transition-colors flex-shrink-0"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>

                  {/* Direct Drag-to-Select Viewport (Shown directly when image exists!) */}
                  {formData.image ? (
                    <DirectImageFramingSelector
                      imageUrl={formData.image}
                      initialPosY={cropPositionY}
                      initialPosX={cropPositionX}
                      onPositionChange={(newY, newX, croppedUrl) => {
                        setCropPositionY(newY);
                        setCropPositionX(newX);
                        if (croppedUrl) {
                          setFormData((prev) => ({ ...prev, card_image: croppedUrl }));
                        }
                      }}
                    />
                  ) : (
                    <div className="rounded-2xl border-2 border-dashed border-border/80 bg-muted/20 p-8 text-center space-y-2">
                      <div className="mx-auto h-12 w-12 rounded-2xl bg-muted/60 flex items-center justify-center text-muted-foreground">
                        <ImageIcon className="h-6 w-6" />
                      </div>
                      <p className="text-xs font-bold text-foreground">
                        No cover image uploaded yet
                      </p>
                      <p className="text-[11px] text-muted-foreground max-w-sm mx-auto">
                        Upload your complete infographic, banner, or photo above. You will be able to drag the 16:9 dashed box directly on the image to choose the card thumbnail view.
                      </p>
                    </div>
                  )}
                </div>

                {/* Tags: Checkboxes from all available tags + Other option */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Tags (Select Multiple)
                    </label>
                    <span className="text-[11px] font-semibold text-primary">
                      {selectedTags.length} tags selected
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 max-h-40 overflow-y-auto p-3 rounded-2xl border border-border bg-muted/25">
                    {allAvailableTags.map((tag) => {
                      const isChecked = selectedTags.includes(tag);
                      return (
                        <label
                          key={tag}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all select-none ${
                            isChecked
                              ? 'border-primary/60 bg-primary/10 text-primary shadow-xs'
                              : 'border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/60'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleTag(tag)}
                            className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5 cursor-pointer accent-primary"
                          />
                          <span>#{tag}</span>
                        </label>
                      );
                    })}

                    {/* Other Custom Tag Input */}
                    {isAddingCustomTag ? (
                      <div className="inline-flex items-center gap-1.5 bg-card border border-primary/60 rounded-xl px-2.5 py-1 shadow-xs animate-in fade-in-50">
                        <input
                          type="text"
                          autoFocus
                          value={customTagInput}
                          onChange={(e) => setCustomTagInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddCustomTag();
                            } else if (e.key === 'Escape') {
                              setIsAddingCustomTag(false);
                            }
                          }}
                          placeholder="Type tag & Enter..."
                          className="text-xs bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground w-32"
                        />
                        <button
                          type="button"
                          onClick={handleAddCustomTag}
                          className="px-2 py-0.5 rounded-lg bg-primary text-primary-foreground text-[10px] font-bold hover:bg-primary/90"
                        >
                          Add
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsAddingCustomTag(false)}
                          className="p-0.5 text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsAddingCustomTag(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-dashed border-primary/50 bg-primary/5 text-primary text-xs font-semibold hover:bg-primary/15 transition-colors"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Other (Add custom tag)...</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Brief Summary / Excerpt
                  </label>
                  <textarea
                    rows={2}
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    placeholder="1-2 sentences summarizing the core idea of the article..."
                    className="w-full rounded-xl border border-border bg-input px-3.5 py-2 text-foreground focus:border-primary focus:outline-none admin-input-smooth leading-relaxed"
                  />
                </div>

                {/* Main Content (Natural Writing - No HTML required) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Article Story / Content *
                    </label>
                    <span className="text-[11px] font-semibold text-primary flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      <span>Drop Cap enabled</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mb-2">
                    Write naturally! Press <strong>Enter twice</strong> for a new paragraph. The first letter of the first paragraph will automatically become an elegant Drop Cap.
                  </p>
                  <textarea
                    rows={9}
                    required
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Write your story here naturally...&#10;&#10;Simply press Enter twice to create a new paragraph. No coding or HTML markup required!"
                    className="w-full rounded-xl border border-border bg-input p-3.5 text-xs text-foreground focus:border-primary focus:outline-none leading-relaxed admin-input-smooth resize-y font-sans"
                  />
                </div>
              </form>
            ) : (
              /* TAB 2: LIVE WEBSITE PREVIEW */
              <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-background/50 custom-scrollbar">
                {/* Simulated Browser Bar */}
                <div className="rounded-2xl border border-border bg-card/80 p-2.5 flex items-center justify-between text-xs text-muted-foreground font-mono shadow-xs">
                  <div className="flex items-center space-x-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
                    <span className="text-foreground/70 ml-2 font-sans font-semibold text-[11px]">
                      Live Website View
                    </span>
                  </div>
                  <div className="truncate max-w-md bg-muted/60 px-3 py-1 rounded-lg border border-border/70 text-[11px]">
                    https://pgtglobalnetwork.com/articles/{formData.slug || 'preview-slug'}
                  </div>
                </div>

                {/* Article Live Layout Container */}
                <div className="rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-sm space-y-8 max-w-3xl mx-auto">
                  {/* Category Tag Badge */}
                  <div className="text-center">
                    <span className="bg-indigo-50/10 dark:bg-indigo-950/20 border border-indigo-200/20 text-indigo-700 dark:text-indigo-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                      {effectiveCategory || 'Uncategorized'}
                    </span>
                  </div>

                  {/* Article Main Title */}
                  <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-tight text-center font-sans">
                    {formData.title || 'Untitled Article'}
                  </h1>

                  {/* Metadata Row */}
                  <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-muted-foreground text-xs sm:text-sm font-medium border-y border-border/60 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-indigo-50/10 border border-indigo-200/20 flex items-center justify-center text-indigo-600 font-bold uppercase text-xs">
                        {(formData.author || 'PG').slice(0, 2)}
                      </div>
                      <span className="font-bold text-foreground">
                        {formData.author || 'Pranav Gujar'}
                      </span>
                    </div>
                    <span className="w-1.5 h-1.5 bg-border rounded-full hidden sm:inline" />
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-muted-foreground/60" />
                      <span>{formData.published_date || getTodayDateString()}</span>
                    </div>
                    <span className="w-1.5 h-1.5 bg-border rounded-full hidden sm:inline" />
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-muted-foreground/60" />
                      <span>{readTimeNumber ? `${readTimeNumber} min read` : '5 min read'}</span>
                    </div>
                  </div>

                  {/* Featured Cover Image */}
                  {formData.image ? (
                    <div className="relative overflow-hidden rounded-3xl border border-border aspect-video shadow-md">
                      <img
                        src={formData.image}
                        alt={formData.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="rounded-3xl border border-dashed border-border bg-muted/30 aspect-video flex flex-col items-center justify-center text-muted-foreground">
                      <ImageIcon className="h-10 w-10 mb-2 opacity-40" />
                      <p className="text-xs font-semibold">No cover image specified yet</p>
                    </div>
                  )}

                  {/* Excerpt callout */}
                  {formData.excerpt && (
                    <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-4 text-sm font-medium text-foreground italic">
                      "{formData.excerpt}"
                    </div>
                  )}

                  {/* Rendered Story Content with Floating Drop Cap */}
                  {formData.content ? (
                    <div className="blog-prose max-w-none text-left">
                      <style>{`
                        .blog-prose p {
                          font-size: 1.125rem !important;
                          line-height: 1.85 !important;
                          color: var(--muted-foreground) !important;
                          margin-top: 0 !important;
                          margin-bottom: 1.75rem !important;
                          font-weight: 400 !important;
                        }
                        .blog-prose p:last-child {
                          margin-bottom: 0 !important;
                        }
                        .blog-prose > p:first-of-type::first-letter,
                        .blog-prose p:first-of-type::first-letter {
                          float: left !important;
                          font-size: 3.15rem !important;
                          line-height: 0.82 !important;
                          margin-top: 3px !important;
                          margin-right: 8px !important;
                          padding: 0 !important;
                          font-weight: 700 !important;
                          color: #6366f1 !important;
                          font-family: 'Georgia', 'Cambria', 'Times New Roman', serif !important;
                          text-transform: uppercase !important;
                        }
                      `}</style>
                      <div dangerouslySetInnerHTML={{ __html: rawTextToHtml(formData.content) }} />
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic text-xs text-center py-6">
                      No story content written yet. Switch back to "Story Editor" to write your article.
                    </p>
                  )}

                  {/* Tags */}
                  {selectedTags.length > 0 && (
                    <div className="pt-6 border-t border-border flex items-center gap-2">
                      <Tag className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div className="flex flex-wrap gap-1.5">
                        {selectedTags.map((t, idx) => (
                          <span
                            key={idx}
                            className="rounded-lg bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="border-t border-border p-3 sm:p-4 bg-muted/20 flex flex-col-reverse xs:flex-row xs:items-center justify-between gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsCreatingNew(false);
                  setEditingArticle(null);
                }}
                className="rounded-xl border border-border px-3.5 sm:px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors admin-btn-press text-center"
              >
                Cancel
              </button>

              <div className="flex items-center space-x-2 w-full xs:w-auto justify-end">
                {modalActiveTab === 'edit' ? (
                  <button
                    type="button"
                    onClick={() => setModalActiveTab('preview')}
                    className="inline-flex items-center space-x-1.5 rounded-xl border border-primary/30 bg-primary/10 px-3 sm:px-4 py-2 text-xs font-bold text-primary hover:bg-primary/20 transition-all admin-btn-press"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span><span className="hidden sm:inline">Preview </span>Live Look</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setModalActiveTab('edit')}
                    className="inline-flex items-center space-x-1.5 rounded-xl border border-border bg-card px-3 sm:px-4 py-2 text-xs font-bold text-foreground hover:bg-muted transition-all admin-btn-press"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    <span><span className="hidden sm:inline">Back to </span>Editor</span>
                  </button>
                )}

                <button
                  form="article-form"
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center justify-center space-x-2 rounded-xl bg-primary px-4 sm:px-5 py-2 text-xs font-bold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-50 admin-btn-press flex-1 xs:flex-none"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>{isCreatingNew ? 'Publish' : 'Save Changes'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Explicit Confirmation Modal for Deletion */}
      <ConfirmDeleteModal
        isOpen={!!articleToDelete}
        title="Delete Article Publication"
        itemDescription={articleToDelete ? `"${articleToDelete.title}"` : undefined}
        onConfirm={confirmDeleteAction}
        onCancel={() => setArticleToDelete(null)}
        isDeleting={isDeleting}
      />
    </div>
  );
};
