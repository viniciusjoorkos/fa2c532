-- =============================================
-- RZ Trader Studio — Migration: Planos v2
-- PARTE 1 de 2: Adicionar novos valores ao enum
-- =============================================
-- Execute ESTE BLOCO primeiro, depois execute a Parte 2.

ALTER TYPE public.user_plan ADD VALUE IF NOT EXISTS 'pro';
ALTER TYPE public.user_plan ADD VALUE IF NOT EXISTS 'gold';
