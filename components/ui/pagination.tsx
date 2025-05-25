'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Pagination = ({
  className,
  ...props
}: React.ComponentProps<'nav'>) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn('mx-auto flex w-full justify-center', className)}
    {...props}
  />
);

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<'ul'>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn('flex flex-row items-center gap-1', className)}
    {...props}
  />
));
PaginationContent.displayName = 'PaginationContent';

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<'li'>
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn('', className)} {...props} />
));
PaginationItem.displayName = 'PaginationItem';

type PaginationButtonProps = {
  isActive?: boolean;
} & React.ComponentProps<typeof Button>;

const PaginationButton = ({
  className,
  isActive,
  size = 'icon',
  ...props
}: PaginationButtonProps) => (
  <Button
    aria-current={isActive ? 'page' : undefined}
    variant={isActive ? 'outline' : 'ghost'}
    size={size}
    className={cn(
      'h-9 w-9 p-0',
      isActive && 'border border-border bg-background hover:bg-background',
      className
    )}
    {...props}
  />
);
PaginationButton.displayName = 'PaginationButton';

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationButton>) => (
  <PaginationButton
    aria-label="Ir a la página anterior"
    size="default"
    className={cn('gap-1 pl-2.5', className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Anterior</span>
  </PaginationButton>
);
PaginationPrevious.displayName = 'PaginationPrevious';

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationButton>) => (
  <PaginationButton
    aria-label="Ir a la página siguiente"
    size="default"
    className={cn('gap-1 pr-2.5', className)}
    {...props}
  >
    <span>Siguiente</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationButton>
);
PaginationNext.displayName = 'PaginationNext';

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<'span'>) => (
  <span
    aria-hidden
    className={cn('flex h-9 w-9 items-center justify-center', className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">Más páginas</span>
  </span>
);
PaginationEllipsis.displayName = 'PaginationEllipsis';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  showPageNumbers?: boolean;
  showPageSizeSelector?: boolean;
  className?: string;
}

export function PaginationComponent({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  showPageNumbers = true,
  showPageSizeSelector = false,
  className = '',
}: PaginationProps) {
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;
  const startItem = Math.min((currentPage - 1) * itemsPerPage + 1, totalItems);
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePrevious = () => {
    if (canGoPrevious) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      onPageChange(currentPage + 1);
    }
  };

  const renderPageNumbers = () => {
    if (!showPageNumbers || totalPages <= 1) return null;

    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    // Botón de primera página
    if (startPage > 1) {
      pages.push(
        <PaginationItem key="first">
          <PaginationButton 
            onClick={() => onPageChange(1)}
            aria-label="Ir a la primera página"
          >
            1
          </PaginationButton>
        </PaginationItem>
      );

      if (startPage > 2) {
        pages.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }


    // Páginas
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationButton
            isActive={i === currentPage}
            onClick={() => onPageChange(i)}
            aria-label={`Ir a la página ${i}`}
            aria-current={i === currentPage ? 'page' : undefined}
          >
            {i}
          </PaginationButton>
        </PaginationItem>
      );
    }

    // Botón de última página
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      pages.push(
        <PaginationItem key={totalPages}>
          <PaginationButton
            onClick={() => onPageChange(totalPages)}
            aria-label={`Ir a la página ${totalPages}`}
          >
            {totalPages}
          </PaginationButton>
        </PaginationItem>
      );
    }

    return pages;
  };

  return (
    <div className={cn('flex flex-col items-center justify-between gap-4 sm:flex-row', className)}>
      <div className="text-sm text-muted-foreground">
        Mostrando <span className="font-medium">{startItem}</span> a{' '}
        <span className="font-medium">{endItem}</span> de{' '}
        <span className="font-medium">{totalItems}</span> resultados
      </div>
      
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={handlePrevious}
              disabled={!canGoPrevious}
              className={!canGoPrevious ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
          
          {showPageNumbers && renderPageNumbers()}
          
          <PaginationItem>
            <PaginationNext
              onClick={handleNext}
              disabled={!canGoNext}
              className={!canGoNext ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationButton,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
