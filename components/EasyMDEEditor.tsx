"use client";

import { useEffect, useRef } from "react";
import type EasyMDE from "easymde";
import "easymde/dist/easymde.min.css";

export default function EasyMDEEditor({
  initialValue,
  onChange,
  placeholder,
}: {
  initialValue?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const easyMDERef = useRef<EasyMDE | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (!textareaRef.current) return;
    let easyMDE: EasyMDE | null = null;
    let cancelled = false;

    import("easymde").then(({ default: EasyMDE }) => {
      if (cancelled || !textareaRef.current) return;
      easyMDE = new EasyMDE({
        element: textareaRef.current,
        initialValue,
        placeholder: placeholder || "Nhập mô tả...",
        toolbar: [
          "heading-1",
          "heading-2",
          "heading-3",
          "|",
          "bold",
          "italic",
          "|",
          "horizontal-rule",
          "code",
          "quote",
          "unordered-list",
          "ordered-list",
          "|",
          "link",
          "|",
          "guide",
        ],
        status: false,
        spellChecker: false,
      });
      easyMDERef.current = easyMDE;

      easyMDE.codemirror.on("change", () => {
        onChangeRef.current(easyMDE!.value());
      });
    });

    return () => {
      cancelled = true;
      easyMDE?.toTextArea();
      easyMDERef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <textarea ref={textareaRef} />;
}
