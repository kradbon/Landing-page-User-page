"use client";

import { Block } from "@/shared/types/landing";
import { Input, TextArea } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { useLandingEditorStore } from "@/features/landing-editor/model/editor-store";

type EditorProps = {
  block: Block;
  onChange: (nextProps: Record<string, any>) => void;
  onUpload: (file: File) => Promise<string>;
};

const editorCopy = {
  en: {
    labels: {
      brand: "Brand",
      announcement: "Announcement",
      links: "Links",
      primaryCta: "Primary CTA",
      secondaryCta: "Secondary CTA",
      eyebrow: "Eyebrow",
      headline: "Headline",
      headlineAccent: "Headline Accent",
      subheadline: "Subheadline",
      heroBullets: "Hero Bullets",
      heroImage: "Hero Image",
      title: "Title",
      description: "Description",
      items: "Items",
      cta: "CTA",
      variant: "Variant",
      logos: "Logos",
      badges: "Badges",
      images: "Images",
      testimonials: "Testimonials",
      plans: "Plans",
      submitLabel: "Submit Label",
      formPlaceholders: "Form Placeholders",
      newsletterTitle: "Newsletter Title",
      newsletterBody: "Newsletter Body",
      footerColumnTitle: "Footer Column Title",
      footerLinks: "Footer Links",
      socialTitle: "Social Title",
      socialLinks: "Social Links",
      footerNote: "Footer Note",
      legal: "Legal",
      body: "Body",
      layout: "Layout",
      image: "Image",
      seoTitle: "SEO Title",
      seoDescription: "SEO Description"
    },
    actions: {
      remove: "Remove",
      addItem: "Add item",
      addLink: "Add link",
      addFeature: "Add feature",
      addPath: "Add path",
      addLogo: "Add logo",
      addImage: "Add image",
      addTestimonial: "Add testimonial",
      addPlan: "Add plan"
    },
    placeholders: {
      text: "Text",
      ctaLabel: "CTA Label",
      ctaLink: "CTA Link",
      label: "Label",
      link: "Link",
      imageUrl: "Image URL",
      title: "Title",
      body: "Body",
      name: "Name",
      role: "Role",
      quote: "Quote",
      price: "Price",
      billingText: "Billing text",
      cta: "CTA",
      badge: "Badge",
      firstName: "First name",
      lastName: "Last name",
      phone: "Phone",
      email: "Email",
      caption: "Caption"
    },
    options: {
      solid: "Solid",
      outline: "Outline",
      brandsStrip: "Brands strip",
      logoGrid: "Logo grid",
      pricing: "Pricing",
      imageRight: "Image right",
      imageLeft: "Image left",
      textOnly: "Text only"
    },
    misc: {
      highlight: "Highlight"
    }
  },
  ru: {
    labels: {
      brand: "Бренд",
      announcement: "Анонс",
      links: "Ссылки",
      primaryCta: "Основной CTA",
      secondaryCta: "Вторичный CTA",
      eyebrow: "Надзаголовок",
      headline: "Заголовок",
      headlineAccent: "Акцент заголовка",
      subheadline: "Подзаголовок",
      heroBullets: "Пункты героя",
      heroImage: "Изображение героя",
      title: "Заголовок",
      description: "Описание",
      items: "Элементы",
      cta: "CTA",
      variant: "Вариант",
      logos: "Логотипы",
      badges: "Бейджи",
      images: "Изображения",
      testimonials: "Отзывы",
      plans: "Планы",
      submitLabel: "Текст кнопки",
      formPlaceholders: "Подсказки формы",
      newsletterTitle: "Заголовок рассылки",
      newsletterBody: "Текст рассылки",
      footerColumnTitle: "Заголовок колонки",
      footerLinks: "Ссылки футера",
      socialTitle: "Заголовок соцсетей",
      socialLinks: "Ссылки соцсетей",
      footerNote: "Примечание футера",
      legal: "Юр. информация",
      body: "Текст",
      layout: "Макет",
      image: "Изображение",
      seoTitle: "SEO заголовок",
      seoDescription: "SEO описание"
    },
    actions: {
      remove: "Удалить",
      addItem: "Добавить пункт",
      addLink: "Добавить ссылку",
      addFeature: "Добавить особенность",
      addPath: "Добавить программу",
      addLogo: "Добавить логотип",
      addImage: "Добавить изображение",
      addTestimonial: "Добавить отзыв",
      addPlan: "Добавить план"
    },
    placeholders: {
      text: "Текст",
      ctaLabel: "Текст CTA",
      ctaLink: "Ссылка CTA",
      label: "Название",
      link: "Ссылка",
      imageUrl: "URL изображения",
      title: "Заголовок",
      body: "Текст",
      name: "Имя",
      role: "Должность",
      quote: "Цитата",
      price: "Цена",
      billingText: "Текст оплаты",
      cta: "CTA",
      badge: "Бейдж",
      firstName: "Имя",
      lastName: "Фамилия",
      phone: "Телефон",
      email: "Email",
      caption: "Подпись"
    },
    options: {
      solid: "Сплошная",
      outline: "Контур",
      brandsStrip: "Лента брендов",
      logoGrid: "Сетка логотипов",
      pricing: "Цены",
      imageRight: "Изображение справа",
      imageLeft: "Изображение слева",
      textOnly: "Только текст"
    },
    misc: {
      highlight: "Выделить"
    }
  },
  tj: {
    labels: {
      brand: "Бренд",
      announcement: "Эълон",
      links: "Пайвандҳо",
      primaryCta: "CTA асосӣ",
      secondaryCta: "CTA дуюм",
      eyebrow: "Сарлавҳаи боло",
      headline: "Сарлавҳа",
      headlineAccent: "Аксенти сарлавҳа",
      subheadline: "Зерсарлавҳа",
      heroBullets: "Нуқтаҳои герой",
      heroImage: "Тасвири герой",
      title: "Сарлавҳа",
      description: "Тавсиф",
      items: "Элементҳо",
      cta: "CTA",
      variant: "Навъ",
      logos: "Логотипҳо",
      badges: "Нишонаҳо",
      images: "Тасвирҳо",
      testimonials: "Шаҳодатномаҳо",
      plans: "Нақшаҳо",
      submitLabel: "Матни тугма",
      formPlaceholders: "Ҷойнишонҳои форма",
      newsletterTitle: "Сарлавҳаи хабарнома",
      newsletterBody: "Матни хабарнома",
      footerColumnTitle: "Сарлавҳаи сутун",
      footerLinks: "Пайвандҳои поён",
      socialTitle: "Сарлавҳаи иҷтимоӣ",
      socialLinks: "Пайвандҳои иҷтимоӣ",
      footerNote: "Ёддошти поён",
      legal: "Маълумоти ҳуқуқӣ",
      body: "Матн",
      layout: "Нақшабандӣ",
      image: "Тасвир",
      seoTitle: "Сарлавҳаи SEO",
      seoDescription: "Тавсифи SEO"
    },
    actions: {
      remove: "Ҳазф кардан",
      addItem: "Илова кардани пункт",
      addLink: "Илова кардани пайванд",
      addFeature: "Илова кардани хусусият",
      addPath: "Илова кардани барнома",
      addLogo: "Илова кардани логотип",
      addImage: "Илова кардани тасвир",
      addTestimonial: "Илова кардани шаҳодатнома",
      addPlan: "Илова кардани нақша"
    },
    placeholders: {
      text: "Матн",
      ctaLabel: "Матни CTA",
      ctaLink: "Пайванди CTA",
      label: "Ном",
      link: "Пайванд",
      imageUrl: "URL-и тасвир",
      title: "Сарлавҳа",
      body: "Матн",
      name: "Ном",
      role: "Нақш",
      quote: "Иқтибос",
      price: "Нарх",
      billingText: "Матни пардохт",
      cta: "CTA",
      badge: "Нишона",
      firstName: "Ном",
      lastName: "Насаб",
      phone: "Телефон",
      email: "Email",
      caption: "Тавзеҳ"
    },
    options: {
      solid: "Пурра",
      outline: "Контур",
      brandsStrip: "Лентаи брендҳо",
      logoGrid: "Тори логотипҳо",
      pricing: "Нархгузорӣ",
      imageRight: "Тасвир рост",
      imageLeft: "Тасвир чап",
      textOnly: "Танҳо матн"
    },
    misc: {
      highlight: "Барҷаста"
    }
  }
};

function useEditorCopy() {
  const { language } = useLandingEditorStore();
  return editorCopy[language] || editorCopy.en;
}

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="flex flex-col gap-2 text-xs font-semibold admin-muted">
      <span className="uppercase tracking-[0.2em]">{label}</span>
      {children}
      {hint ? <span className="text-[11px] font-normal admin-muted">{hint}</span> : null}
    </label>
  );
}

function ListItemActions({ onRemove }: { onRemove: () => void }) {
  const t = useEditorCopy();
  return (
    <Button type="button" variant="ghost" className="h-9 px-3 text-xs" onClick={onRemove}>
      {t.actions.remove}
    </Button>
  );
}

function TextListEditor({
  items,
  onChange
}: {
  items: string[];
  onChange: (next: string[]) => void;
}) {
  const t = useEditorCopy();
  return (
    <div className="space-y-2">
      {items.map((value, index) => (
        <div key={`${value}-${index}`} className="flex items-center gap-2">
          <Input
            value={value}
            onChange={(event) => {
              const next = [...items];
              next[index] = event.target.value;
              onChange(next);
            }}
          />
          <ListItemActions onRemove={() => onChange(items.filter((_, i) => i !== index))} />
        </div>
      ))}
      <Button type="button" variant="ghost" className="w-full text-xs" onClick={() => onChange([...items, ""])}>
        {t.actions.addItem}
      </Button>
    </div>
  );
}

export function NavbarEditor({ block, onChange }: EditorProps) {
  const props = block.props;
  const t = useEditorCopy();
  return (
    <div className="space-y-4">
      <Field label={t.labels.brand}>
        <Input value={props.brand || ""} onChange={(e) => onChange({ ...props, brand: e.target.value })} />
      </Field>
      <Field label={t.labels.announcement}>
        <Input
          value={props.announcement?.text || ""}
          onChange={(e) =>
            onChange({ ...props, announcement: { ...props.announcement, text: e.target.value } })
          }
          placeholder={t.placeholders.text}
        />
        <div className="grid gap-2 md:grid-cols-2">
          <Input
            value={props.announcement?.cta || ""}
            onChange={(e) =>
              onChange({ ...props, announcement: { ...props.announcement, cta: e.target.value } })
            }
            placeholder={t.placeholders.ctaLabel}
          />
          <Input
            value={props.announcement?.href || ""}
            onChange={(e) =>
              onChange({ ...props, announcement: { ...props.announcement, href: e.target.value } })
            }
            placeholder={t.placeholders.ctaLink}
          />
        </div>
      </Field>
      <Field label={t.labels.links}>
        <div className="space-y-3">
          {(props.links || []).map((link: any, index: number) => (
            <div key={`${link.label}-${index}`} className="grid gap-2 rounded-[12px] border admin-card p-3">
              <Input
                value={link.label}
                onChange={(e) => {
                  const next = [...props.links];
                  next[index] = { ...next[index], label: e.target.value };
                  onChange({ ...props, links: next });
                }}
                placeholder={t.placeholders.label}
              />
              <div className="flex items-center gap-2">
                <Input
                  value={link.href}
                  onChange={(e) => {
                    const next = [...props.links];
                    next[index] = { ...next[index], href: e.target.value };
                    onChange({ ...props, links: next });
                  }}
                  placeholder={t.placeholders.link}
                />
                <ListItemActions
                  onRemove={() => onChange({ ...props, links: props.links.filter((_: any, i: number) => i !== index) })}
                />
              </div>
            </div>
          ))}
          <Button type="button" variant="ghost" className="w-full text-xs" onClick={() => onChange({ ...props, links: [...(props.links || []), { label: "", href: "" }] })}>
            {t.actions.addLink}
          </Button>
        </div>
      </Field>
      <Field label={t.labels.primaryCta}>
        <div className="grid gap-2 md:grid-cols-2">
          <Input
            value={props.cta?.label || ""}
            onChange={(e) => onChange({ ...props, cta: { ...props.cta, label: e.target.value } })}
            placeholder={t.placeholders.label}
          />
          <Input
            value={props.cta?.href || ""}
            onChange={(e) => onChange({ ...props, cta: { ...props.cta, href: e.target.value } })}
            placeholder={t.placeholders.link}
          />
        </div>
        <select
          className="admin-control admin-select mt-2 rounded-theme border px-3 py-2 text-xs"
          value={props.cta?.variant || "solid"}
          onChange={(e) => onChange({ ...props, cta: { ...props.cta, variant: e.target.value } })}
        >
          <option value="solid">{t.options.solid}</option>
          <option value="outline">{t.options.outline}</option>
        </select>
      </Field>
      <Field label={t.labels.secondaryCta}>
        <div className="grid gap-2 md:grid-cols-2">
          <Input
            value={props.secondaryCta?.label || ""}
            onChange={(e) =>
              onChange({ ...props, secondaryCta: { ...props.secondaryCta, label: e.target.value } })
            }
            placeholder={t.placeholders.label}
          />
          <Input
            value={props.secondaryCta?.href || ""}
            onChange={(e) =>
              onChange({ ...props, secondaryCta: { ...props.secondaryCta, href: e.target.value } })
            }
            placeholder={t.placeholders.link}
          />
        </div>
      </Field>
    </div>
  );
}

export function HeroEditor({ block, onChange, onUpload }: EditorProps) {
  const props = block.props;
  const t = useEditorCopy();
  return (
    <div className="space-y-4">
      <Field label={t.labels.eyebrow}>
        <Input value={props.eyebrow || ""} onChange={(e) => onChange({ ...props, eyebrow: e.target.value })} />
      </Field>
      <Field label={t.labels.headline}>
        <Input value={props.headline || ""} onChange={(e) => onChange({ ...props, headline: e.target.value })} />
      </Field>
      <Field label={t.labels.headlineAccent}>
        <Input value={props.headlineAccent || ""} onChange={(e) => onChange({ ...props, headlineAccent: e.target.value })} />
      </Field>
      <Field label={t.labels.subheadline}>
        <TextArea value={props.subheadline || ""} onChange={(e) => onChange({ ...props, subheadline: e.target.value })} />
      </Field>
      <Field label={t.labels.primaryCta}>
        <div className="grid gap-2 md:grid-cols-2">
          <Input
            value={props.primaryCta?.label || ""}
            onChange={(e) => onChange({ ...props, primaryCta: { ...props.primaryCta, label: e.target.value } })}
            placeholder={t.placeholders.label}
          />
          <Input
            value={props.primaryCta?.href || ""}
            onChange={(e) => onChange({ ...props, primaryCta: { ...props.primaryCta, href: e.target.value } })}
            placeholder={t.placeholders.link}
          />
        </div>
        <select
          className="admin-control admin-select mt-2 rounded-theme border px-3 py-2 text-xs"
          value={props.primaryCta?.variant || "solid"}
          onChange={(e) => onChange({ ...props, primaryCta: { ...props.primaryCta, variant: e.target.value } })}
        >
          <option value="solid">{t.options.solid}</option>
          <option value="outline">{t.options.outline}</option>
        </select>
      </Field>
      <Field label={t.labels.secondaryCta}>
        <div className="grid gap-2 md:grid-cols-2">
          <Input
            value={props.secondaryCta?.label || ""}
            onChange={(e) => onChange({ ...props, secondaryCta: { ...props.secondaryCta, label: e.target.value } })}
            placeholder={t.placeholders.label}
          />
          <Input
            value={props.secondaryCta?.href || ""}
            onChange={(e) => onChange({ ...props, secondaryCta: { ...props.secondaryCta, href: e.target.value } })}
            placeholder={t.placeholders.link}
          />
        </div>
      </Field>
      <Field label={t.labels.heroBullets}>
        <TextListEditor items={props.bullets || []} onChange={(next) => onChange({ ...props, bullets: next })} />
      </Field>
      <Field label={t.labels.heroImage}>
        <div className="space-y-2">
          <Input value={props.image || ""} onChange={(e) => onChange({ ...props, image: e.target.value })} placeholder={t.placeholders.imageUrl} />
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              if (!e.target.files?.[0]) return;
              const url = await onUpload(e.target.files[0]);
              onChange({ ...props, image: url });
            }}
          />
        </div>
      </Field>
    </div>
  );
}

export function FeatureGridEditor({ block, onChange }: EditorProps) {
  const props = block.props;
  const t = useEditorCopy();
  return (
    <div className="space-y-4">
      <Field label={t.labels.eyebrow}>
        <Input value={props.eyebrow || ""} onChange={(e) => onChange({ ...props, eyebrow: e.target.value })} />
      </Field>
      <Field label={t.labels.title}>
        <Input value={props.title || ""} onChange={(e) => onChange({ ...props, title: e.target.value })} />
      </Field>
      <Field label={t.labels.description}>
        <TextArea value={props.description || ""} onChange={(e) => onChange({ ...props, description: e.target.value })} />
      </Field>
      <Field label={t.labels.items}>
        <div className="space-y-3">
          {(props.items || []).map((item: any, index: number) => (
            <div key={`${item.title}-${index}`} className="space-y-2 rounded-[12px] border admin-card p-3">
              <Input
                value={item.title}
                onChange={(e) => {
                  const next = [...props.items];
                  next[index] = { ...next[index], title: e.target.value };
                  onChange({ ...props, items: next });
                }}
                placeholder={t.placeholders.title}
              />
              <TextArea
                value={item.body}
                onChange={(e) => {
                  const next = [...props.items];
                  next[index] = { ...next[index], body: e.target.value };
                  onChange({ ...props, items: next });
                }}
                placeholder={t.placeholders.body}
              />
              <ListItemActions onRemove={() => onChange({ ...props, items: props.items.filter((_: any, i: number) => i !== index) })} />
            </div>
          ))}
          <Button type="button" variant="ghost" className="w-full text-xs" onClick={() => onChange({ ...props, items: [...(props.items || []), { title: "", body: "" }] })}>
            {t.actions.addFeature}
          </Button>
        </div>
      </Field>
    </div>
  );
}

export function PathsEditor({ block, onChange, onUpload }: EditorProps) {
  const props = block.props;
  const t = useEditorCopy();
  return (
    <div className="space-y-4">
      <Field label={t.labels.eyebrow}>
        <Input value={props.eyebrow || ""} onChange={(e) => onChange({ ...props, eyebrow: e.target.value })} />
      </Field>
      <Field label={t.labels.title}>
        <Input value={props.title || ""} onChange={(e) => onChange({ ...props, title: e.target.value })} />
      </Field>
      <Field label={t.labels.description}>
        <TextArea value={props.description || ""} onChange={(e) => onChange({ ...props, description: e.target.value })} />
      </Field>
      <Field label={t.labels.items}>
        <div className="space-y-3">
          {(props.items || []).map((item: any, index: number) => (
            <div key={`${item.title}-${index}`} className="space-y-2 rounded-[12px] border admin-card p-3">
              <Input
                value={item.title}
                onChange={(e) => {
                  const next = [...props.items];
                  next[index] = { ...next[index], title: e.target.value };
                  onChange({ ...props, items: next });
                }}
                placeholder={t.placeholders.title}
              />
              <TextArea
                value={item.body}
                onChange={(e) => {
                  const next = [...props.items];
                  next[index] = { ...next[index], body: e.target.value };
                  onChange({ ...props, items: next });
                }}
                placeholder={t.placeholders.body}
              />
              <div className="space-y-2">
                <Input
                  value={item.image || ""}
                  onChange={(e) => {
                    const next = [...props.items];
                    next[index] = { ...next[index], image: e.target.value };
                    onChange({ ...props, items: next });
                  }}
                  placeholder={t.placeholders.imageUrl}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    if (!e.target.files?.[0]) return;
                    const url = await onUpload(e.target.files[0]);
                    const next = [...props.items];
                    next[index] = { ...next[index], image: url };
                    onChange({ ...props, items: next });
                  }}
                />
              </div>
              <ListItemActions onRemove={() => onChange({ ...props, items: props.items.filter((_: any, i: number) => i !== index) })} />
            </div>
          ))}
          <Button type="button" variant="ghost" className="w-full text-xs" onClick={() => onChange({ ...props, items: [...(props.items || []), { title: "", body: "", image: "" }] })}>
            {t.actions.addPath}
          </Button>
        </div>
      </Field>
      <Field label={t.labels.cta}>
        <div className="grid gap-2 md:grid-cols-2">
          <Input
            value={props.cta?.label || ""}
            onChange={(e) => onChange({ ...props, cta: { ...props.cta, label: e.target.value } })}
            placeholder={t.placeholders.label}
          />
          <Input
            value={props.cta?.href || ""}
            onChange={(e) => onChange({ ...props, cta: { ...props.cta, href: e.target.value } })}
            placeholder={t.placeholders.link}
          />
        </div>
      </Field>
    </div>
  );
}

export function LogosEditor({ block, onChange, onUpload }: EditorProps) {
  const props = block.props;
  const t = useEditorCopy();
  return (
    <div className="space-y-4">
      <Field label={t.labels.variant}>
        <select
          className="admin-control admin-select rounded-theme border px-3 py-2 text-sm"
          value={props.variant || "brands"}
          onChange={(e) => onChange({ ...props, variant: e.target.value })}
        >
          <option value="brands">{t.options.brandsStrip}</option>
          <option value="tools">{t.options.logoGrid}</option>
        </select>
      </Field>
      <Field label={t.labels.title}>
        <Input value={props.title || ""} onChange={(e) => onChange({ ...props, title: e.target.value })} />
      </Field>
      {props.variant === "tools" ? (
        <Field label={t.labels.badges}>
          <TextListEditor items={props.badges || []} onChange={(next) => onChange({ ...props, badges: next })} />
        </Field>
      ) : null}
      <Field label={t.labels.logos}>
        <div className="space-y-3">
          {(props.logos || []).map((logo: any, index: number) => (
            <div key={`${logo.name}-${index}`} className="space-y-2 rounded-[12px] border admin-card p-3">
              <Input
                value={logo.name}
                onChange={(e) => {
                  const next = [...props.logos];
                  next[index] = { ...next[index], name: e.target.value };
                  onChange({ ...props, logos: next });
                }}
                placeholder={t.placeholders.name}
              />
              {props.variant === "tools" ? (
                <div className="space-y-2">
                  <Input
                    value={logo.url || ""}
                    onChange={(e) => {
                      const next = [...props.logos];
                      next[index] = { ...next[index], url: e.target.value };
                      onChange({ ...props, logos: next });
                    }}
                    placeholder={t.placeholders.imageUrl}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      if (!e.target.files?.[0]) return;
                      const url = await onUpload(e.target.files[0]);
                      const next = [...props.logos];
                      next[index] = { ...next[index], url };
                      onChange({ ...props, logos: next });
                    }}
                  />
                </div>
              ) : null}
              <ListItemActions onRemove={() => onChange({ ...props, logos: props.logos.filter((_: any, i: number) => i !== index) })} />
            </div>
          ))}
          <Button
            type="button"
            variant="ghost"
            className="w-full text-xs"
            onClick={() =>
            onChange({
                ...props,
                logos: [...(props.logos || []), { name: "", url: "" }]
              })
            }
          >
            {t.actions.addLogo}
          </Button>
        </div>
      </Field>
    </div>
  );
}

export function GalleryEditor({ block, onChange, onUpload }: EditorProps) {
  const props = block.props;
  const t = useEditorCopy();
  return (
    <div className="space-y-4">
      <Field label={t.labels.eyebrow}>
        <Input value={props.eyebrow || ""} onChange={(e) => onChange({ ...props, eyebrow: e.target.value })} />
      </Field>
      <Field label={t.labels.title}>
        <Input value={props.title || ""} onChange={(e) => onChange({ ...props, title: e.target.value })} />
      </Field>
      <Field label={t.labels.description}>
        <TextArea value={props.description || ""} onChange={(e) => onChange({ ...props, description: e.target.value })} />
      </Field>
      <Field label={t.labels.images}>
        <div className="space-y-3">
          {(props.images || []).map((img: any, index: number) => (
            <div key={`${img.caption}-${index}`} className="space-y-2 rounded-[12px] border admin-card p-3">
              <Input
                value={img.caption}
                onChange={(e) => {
                  const next = [...props.images];
                  next[index] = { ...next[index], caption: e.target.value };
                  onChange({ ...props, images: next });
                }}
                placeholder={t.placeholders.caption}
              />
              <Input
                value={img.url}
                onChange={(e) => {
                  const next = [...props.images];
                  next[index] = { ...next[index], url: e.target.value };
                  onChange({ ...props, images: next });
                }}
                placeholder={t.placeholders.imageUrl}
              />
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  if (!e.target.files?.[0]) return;
                  const url = await onUpload(e.target.files[0]);
                  const next = [...props.images];
                  next[index] = { ...next[index], url };
                  onChange({ ...props, images: next });
                }}
              />
              <ListItemActions onRemove={() => onChange({ ...props, images: props.images.filter((_: any, i: number) => i !== index) })} />
            </div>
          ))}
          <Button type="button" variant="ghost" className="w-full text-xs" onClick={() => onChange({ ...props, images: [...(props.images || []), { url: "", caption: "" }] })}>
            {t.actions.addImage}
          </Button>
        </div>
      </Field>
    </div>
  );
}

export function TestimonialsEditor({ block, onChange, onUpload }: EditorProps) {
  const props = block.props;
  const t = useEditorCopy();
  return (
    <div className="space-y-4">
      <Field label={t.labels.eyebrow}>
        <Input value={props.eyebrow || ""} onChange={(e) => onChange({ ...props, eyebrow: e.target.value })} />
      </Field>
      <Field label={t.labels.title}>
        <Input value={props.title || ""} onChange={(e) => onChange({ ...props, title: e.target.value })} />
      </Field>
      <Field label={t.labels.description}>
        <TextArea value={props.description || ""} onChange={(e) => onChange({ ...props, description: e.target.value })} />
      </Field>
      <Field label={t.labels.testimonials}>
        <div className="space-y-3">
          {(props.items || []).map((item: any, index: number) => (
            <div key={`${item.name}-${index}`} className="space-y-2 rounded-[12px] border admin-card p-3">
              <Input
                value={item.name}
                onChange={(e) => {
                  const next = [...props.items];
                  next[index] = { ...next[index], name: e.target.value };
                  onChange({ ...props, items: next });
                }}
                placeholder={t.placeholders.name}
              />
              <Input
                value={item.role}
                onChange={(e) => {
                  const next = [...props.items];
                  next[index] = { ...next[index], role: e.target.value };
                  onChange({ ...props, items: next });
                }}
                placeholder={t.placeholders.role}
              />
              <TextArea
                value={item.quote}
                onChange={(e) => {
                  const next = [...props.items];
                  next[index] = { ...next[index], quote: e.target.value };
                  onChange({ ...props, items: next });
                }}
                placeholder={t.placeholders.quote}
              />
              <Input
                value={item.image || ""}
                onChange={(e) => {
                  const next = [...props.items];
                  next[index] = { ...next[index], image: e.target.value };
                  onChange({ ...props, items: next });
                }}
                placeholder={t.placeholders.imageUrl}
              />
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  if (!e.target.files?.[0]) return;
                  const url = await onUpload(e.target.files[0]);
                  const next = [...props.items];
                  next[index] = { ...next[index], image: url };
                  onChange({ ...props, items: next });
                }}
              />
              <ListItemActions onRemove={() => onChange({ ...props, items: props.items.filter((_: any, i: number) => i !== index) })} />
            </div>
          ))}
          <Button type="button" variant="ghost" className="w-full text-xs" onClick={() => onChange({ ...props, items: [...(props.items || []), { name: "", role: "", quote: "", image: "" }] })}>
            {t.actions.addTestimonial}
          </Button>
        </div>
      </Field>
    </div>
  );
}

export function FaqEditor({ block, onChange }: EditorProps) {
  const props = block.props;
  const t = useEditorCopy();
  return (
    <div className="space-y-4">
      <Field label={t.labels.variant}>
        <select
          className="admin-control admin-select rounded-theme border px-3 py-2 text-sm"
          value={props.variant || "pricing"}
          onChange={(e) => onChange({ ...props, variant: e.target.value })}
        >
          <option value="pricing">{t.options.pricing}</option>
        </select>
      </Field>
      <Field label={t.labels.eyebrow}>
        <Input value={props.eyebrow || ""} onChange={(e) => onChange({ ...props, eyebrow: e.target.value })} />
      </Field>
      <Field label={t.labels.title}>
        <Input value={props.title || ""} onChange={(e) => onChange({ ...props, title: e.target.value })} />
      </Field>
      <Field label={t.labels.plans}>
        <div className="space-y-3">
          {(props.items || []).map((item: any, index: number) => (
            <div key={`${item.title}-${index}`} className="space-y-2 rounded-[12px] border admin-card p-3">
              <Input
                value={item.title}
                onChange={(e) => {
                  const next = [...props.items];
                  next[index] = { ...next[index], title: e.target.value };
                  onChange({ ...props, items: next });
                }}
                placeholder={t.placeholders.title}
              />
              <Input
                value={item.price}
                onChange={(e) => {
                  const next = [...props.items];
                  next[index] = { ...next[index], price: e.target.value };
                  onChange({ ...props, items: next });
                }}
                placeholder={t.placeholders.price}
              />
              <Input
                value={item.billing}
                onChange={(e) => {
                  const next = [...props.items];
                  next[index] = { ...next[index], billing: e.target.value };
                  onChange({ ...props, items: next });
                }}
                placeholder={t.placeholders.billingText}
              />
              <TextListEditor
                items={item.features || []}
                onChange={(nextFeatures) => {
                  const next = [...props.items];
                  next[index] = { ...next[index], features: nextFeatures };
                  onChange({ ...props, items: next });
                }}
              />
              <Input
                value={item.cta}
                onChange={(e) => {
                  const next = [...props.items];
                  next[index] = { ...next[index], cta: e.target.value };
                  onChange({ ...props, items: next });
                }}
                placeholder={t.placeholders.cta}
              />
              <div className="flex items-center gap-3 text-xs admin-muted">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={Boolean(item.highlight)}
                    onChange={(e) => {
                      const next = [...props.items];
                      next[index] = { ...next[index], highlight: e.target.checked };
                      onChange({ ...props, items: next });
                    }}
                  />
                  {t.misc.highlight}
                </label>
                <Input
                  value={item.badge || ""}
                  onChange={(e) => {
                    const next = [...props.items];
                    next[index] = { ...next[index], badge: e.target.value };
                    onChange({ ...props, items: next });
                  }}
                  placeholder={t.placeholders.badge}
                />
              </div>
              <ListItemActions onRemove={() => onChange({ ...props, items: props.items.filter((_: any, i: number) => i !== index) })} />
            </div>
          ))}
          <Button type="button" variant="ghost" className="w-full text-xs" onClick={() => onChange({ ...props, items: [...(props.items || []), { title: "", price: "", billing: "", features: [], cta: "" }] })}>
            {t.actions.addPlan}
          </Button>
        </div>
      </Field>
    </div>
  );
}

export function ApplyFormEditor({ block, onChange }: EditorProps) {
  const props = block.props;
  const t = useEditorCopy();
  return (
    <div className="space-y-4">
      <Field label={t.labels.eyebrow}>
        <Input value={props.eyebrow || ""} onChange={(e) => onChange({ ...props, eyebrow: e.target.value })} />
      </Field>
      <Field label={t.labels.title}>
        <Input value={props.title || ""} onChange={(e) => onChange({ ...props, title: e.target.value })} />
      </Field>
      <Field label={t.labels.description}>
        <TextArea value={props.description || ""} onChange={(e) => onChange({ ...props, description: e.target.value })} />
      </Field>
      <Field label={t.labels.submitLabel}>
        <Input value={props.submitLabel || ""} onChange={(e) => onChange({ ...props, submitLabel: e.target.value })} />
      </Field>
      <Field label={t.labels.formPlaceholders}>
        <div className="grid gap-2">
          <Input
            value={props.fields?.firstName || ""}
            onChange={(e) => onChange({ ...props, fields: { ...props.fields, firstName: e.target.value } })}
            placeholder={t.placeholders.firstName}
          />
          <Input
            value={props.fields?.lastName || ""}
            onChange={(e) => onChange({ ...props, fields: { ...props.fields, lastName: e.target.value } })}
            placeholder={t.placeholders.lastName}
          />
          <Input
            value={props.fields?.phone || ""}
            onChange={(e) => onChange({ ...props, fields: { ...props.fields, phone: e.target.value } })}
            placeholder={t.placeholders.phone}
          />
          <Input
            value={props.fields?.email || ""}
            onChange={(e) => onChange({ ...props, fields: { ...props.fields, email: e.target.value } })}
            placeholder={t.placeholders.email}
          />
        </div>
      </Field>
    </div>
  );
}

export function FooterEditor({ block, onChange }: EditorProps) {
  const props = block.props;
  const t = useEditorCopy();
  return (
    <div className="space-y-4">
      <Field label={t.labels.newsletterTitle}>
        <Input value={props.newsletterTitle || ""} onChange={(e) => onChange({ ...props, newsletterTitle: e.target.value })} />
      </Field>
      <Field label={t.labels.newsletterBody}>
        <TextArea value={props.newsletterBody || ""} onChange={(e) => onChange({ ...props, newsletterBody: e.target.value })} />
      </Field>
      <Field label={t.labels.footerColumnTitle}>
        <Input
          value={props.columns?.[0]?.title || ""}
          onChange={(e) =>
            onChange({
              ...props,
              columns: [{ ...(props.columns?.[0] || {}), title: e.target.value }]
            })
          }
        />
      </Field>
      <Field label={t.labels.footerLinks}>
        <TextListEditor
          items={props.columns?.[0]?.links || []}
          onChange={(next) =>
            onChange({
              ...props,
              columns: [{ ...(props.columns?.[0] || {}), links: next }]
            })
          }
        />
      </Field>
      <Field label={t.labels.socialTitle}>
        <Input
          value={props.socials?.title || ""}
          onChange={(e) => onChange({ ...props, socials: { ...props.socials, title: e.target.value } })}
        />
      </Field>
      <Field label={t.labels.socialLinks}>
        <TextListEditor
          items={props.socials?.links || []}
          onChange={(next) => onChange({ ...props, socials: { ...props.socials, links: next } })}
        />
      </Field>
      <Field label={t.labels.footerNote}>
        <Input value={props.note || ""} onChange={(e) => onChange({ ...props, note: e.target.value })} />
      </Field>
      <Field label={t.labels.legal}>
        <Input value={props.legal || ""} onChange={(e) => onChange({ ...props, legal: e.target.value })} />
      </Field>
    </div>
  );
}

export function CustomSectionEditor({ block, onChange, onUpload }: EditorProps) {
  const props = block.props;
  const t = useEditorCopy();
  return (
    <div className="space-y-4">
      <Field label={t.labels.eyebrow}>
        <Input value={props.eyebrow || ""} onChange={(e) => onChange({ ...props, eyebrow: e.target.value })} />
      </Field>
      <Field label={t.labels.title}>
        <Input value={props.title || ""} onChange={(e) => onChange({ ...props, title: e.target.value })} />
      </Field>
      <Field label={t.labels.body}>
        <TextArea value={props.body || ""} onChange={(e) => onChange({ ...props, body: e.target.value })} />
      </Field>
      <Field label={t.labels.layout}>
        <select
          className="admin-control admin-select rounded-theme border px-3 py-2 text-xs"
          value={props.layout || "image-right"}
          onChange={(e) => onChange({ ...props, layout: e.target.value })}
        >
          <option value="image-right">{t.options.imageRight}</option>
          <option value="image-left">{t.options.imageLeft}</option>
          <option value="text-only">{t.options.textOnly}</option>
        </select>
      </Field>
      <Field label={t.labels.image}>
        <div className="space-y-2">
          <Input value={props.image || ""} onChange={(e) => onChange({ ...props, image: e.target.value })} placeholder={t.placeholders.imageUrl} />
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              if (!e.target.files?.[0]) return;
              const url = await onUpload(e.target.files[0]);
              onChange({ ...props, image: url });
            }}
          />
        </div>
      </Field>
      <Field label={t.labels.cta}>
        <div className="grid gap-2 md:grid-cols-2">
          <Input
            value={props.ctaLabel || ""}
            onChange={(e) => onChange({ ...props, ctaLabel: e.target.value })}
            placeholder={t.placeholders.label}
          />
          <Input
            value={props.ctaHref || ""}
            onChange={(e) => onChange({ ...props, ctaHref: e.target.value })}
            placeholder={t.placeholders.link}
          />
        </div>
      </Field>
    </div>
  );
}

export function SeoEditor({ title, description, onChange }: { title: string; description: string; onChange: (next: { title: string; description: string }) => void }) {
  const t = useEditorCopy();
  return (
    <div className="space-y-4">
      <Field label={t.labels.seoTitle}>
        <Input value={title} onChange={(e) => onChange({ title: e.target.value, description })} />
      </Field>
      <Field label={t.labels.seoDescription}>
        <TextArea value={description} onChange={(e) => onChange({ title, description: e.target.value })} />
      </Field>
    </div>
  );
}
