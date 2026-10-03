import { useCallback, useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import './ConfirmDialog.css';

/**
 * ConfirmDialog — confirmación de una acción destructiva, en el lenguaje
 * visual del club. Reemplaza a window.confirm(), que abre un diálogo del
 * browser: se ve fuera del sistema de diseño, bloquea el hilo y no se puede
 * estilizar ni traducir.
 *
 * Accesibilidad:
 *   - role="dialog" + aria-modal, etiquetado y descrito por su título y cuerpo
 *   - Escape cancela, click en el fondo cancela
 *   - el foco entra al panel y queda atrapado dentro mientras está abierto
 *   - al cerrar, el foco vuelve al elemento que lo abrió
 *   - aria-busy mientras la acción está en curso
 *
 * Monta en document.body para no quedar atrapado en el stacking context del
 * navbar ni de un card con transform.
 */

const FOCUSABLE = [
  'button:not([disabled])',
  '[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

const ConfirmDialog = ({
  open,
  title,
  children,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Volver',
  destructive = false,
  busy = false,
  onConfirm,
  onCancel,
}) => {
  const panelRef = useRef(null);
  const confirmRef = useRef(null);
  const restoreRef = useRef(null);
  const uid = useId();

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        onCancel();
        return;
      }
      if (event.key !== 'Tab') return;

      const panel = panelRef.current;
      if (!panel) return;
      const items = [...panel.querySelectorAll(FOCUSABLE)].filter(
        (el) => el.offsetWidth > 0 || el.offsetHeight > 0,
      );
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [onCancel],
  );

  useEffect(() => {
    if (!open) return undefined;

    restoreRef.current = document.activeElement;
    // El foco arranca en la acción principal: en un diálogo destructivo eso
    // ya es una confirmación implícita, y Escape está a un tecla de distancia.
    confirmRef.current?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown, true);

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      document.body.style.overflow = previousOverflow;
      if (restoreRef.current instanceof HTMLElement) restoreRef.current.focus();
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  const titleId = `confirm-title-${uid}`;
  const bodyId = `confirm-body-${uid}`;

  return createPortal(
    <div
      className='confirm'
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}>
      <div
        className='confirm__panel'
        role='dialog'
        aria-modal='true'
        aria-labelledby={titleId}
        aria-describedby={bodyId}
        ref={panelRef}>
        <span
          className={`confirm__mark${destructive ? ' confirm__mark--danger' : ''}`}
          aria-hidden='true'>
          <i className={`bi ${destructive ? 'bi-exclamation-triangle-fill' : 'bi-question-lg'}`}></i>
        </span>

        <h2 className='confirm__title' id={titleId}>
          {title}
        </h2>
        <div className='confirm__body' id={bodyId}>
          {children}
        </div>

        <div className='confirm__actions'>
          <button
            type='button'
            className='btn btn--ghost'
            onClick={onCancel}
            disabled={busy}>
            {cancelLabel}
          </button>
          <button
            type='button'
            className={`btn ${destructive ? 'btn--danger' : 'btn--brand'}`}
            onClick={onConfirm}
            disabled={busy}
            aria-busy={busy}
            ref={confirmRef}>
            {busy && <span className='confirm__spinner' aria-hidden='true'></span>}
            <i
              className={`bi ${destructive ? 'bi-x-circle' : 'bi-check-circle'}`}
              aria-hidden='true'></i>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

ConfirmDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
  confirmLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  destructive: PropTypes.bool,
  busy: PropTypes.bool,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ConfirmDialog;
