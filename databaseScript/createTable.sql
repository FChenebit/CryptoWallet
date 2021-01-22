-- Table: public.currency_rate

-- DROP TABLE public."currency_rate";

CREATE TABLE public."currency_rate"
(
    "rate_id" serial PRIMARY KEY,
    "rate_date" date NOT NULL,
    "currency_code" character varying(10) COLLATE pg_catalog."default" NOT NULL,
    "rate_value" numeric
)

TABLESPACE pg_default;

ALTER TABLE public."currency_rate"
    OWNER to francoischenebit;

CREATE INDEX idx_rate_date on currency_rate(rate_date); 
CREATE INDEX idx_currency_code on currency_rate(currency_code);    