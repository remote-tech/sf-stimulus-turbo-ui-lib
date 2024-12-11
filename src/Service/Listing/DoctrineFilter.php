<?php

namespace RemoteTech\SfStimulusTurboUI\Service\Listing;

use RemoteTech\SfStimulusTurboUI\Service\SqidService;
use Doctrine\ORM\QueryBuilder;
use LogicException;

class DoctrineFilter
{
    public const array ALLOWED_OPERATORS_NUMERIC = ['eq', 'gt', 'lt'];
    public const array ALLOWED_OPERATORS_STRING = ['eq', 'starts', 'ends', 'contains'];
    public const array ALLOWED_OPERATORS_ENUM = ['eq'];

    public const array OPERATOR_TEXT = [
        'eq' => 'equals',
        'gt' => 'greater than',
        'lt' => 'lower than',
        'starts' => 'starts with',
        'ends' => 'ends with',
        'contains' => 'contains',
        'between' => 'between',
        'in' => 'any of'
    ];

    public const array ALLOWED_OPERATOR_TYPES = [
        'int' => self::ALLOWED_OPERATORS_NUMERIC,
        'float' => self::ALLOWED_OPERATORS_NUMERIC,
        'string' => self::ALLOWED_OPERATORS_STRING,
        'enum' => self::ALLOWED_OPERATORS_ENUM
    ];

    public function __construct(private readonly SqidService $sqidService)
    {
    }

    public function addFilters(array $filters, ColumnsManager $columnsManager, QueryBuilder $qb): void
    {
        foreach ($filters as $key => $filter) {
            $column = $columnsManager->getColumn($key);
            if (!isset($column) || !$column->isFilter()) {
                throw new LogicException('Cannot filter by ' . $key);
            }

            if ($column->isEncoded()) {
                $filter['value'] = $this->sqidService->decodeSingleId($filter['value']);
            }
            // TODO: Add operator validation

            $this->computeQbOperation($qb, $column, $filter, $key);
        }
    }

    protected function computeQbOperation(QueryBuilder $qb, Column $column, array $filter, string $key): void
    {
        // TODO: Likes are vulnerable to wildcard injection

        switch ($filter['op']) {
            case 'eq':
                $qb->andWhere($column->getDbFilter() . ' = :' . $key);
                $qb->setParameter($key, $filter['value']);
                break;
            case 'lt':
                $qb->andWhere($column->getDbFilter() . ' < :' . $key);
                $qb->setParameter($key, $filter['value']);
                break;
            case 'gt':
                $qb->andWhere($column->getDbFilter() . ' > :' . $key);
                $qb->setParameter($key, $filter['value']);
                break;
            case 'starts':
                $qb->andWhere($qb->expr()->like($column->getDbFilter(), ':' . $key));
                $qb->setParameter($key, $filter['value'] . '%');
                break;
            case 'ends':
                $qb->andWhere($qb->expr()->like($column->getDbFilter(), ':' . $key));
                $qb->setParameter($key, '%' . $filter['value']);
                break;
            case 'contains':
                $qb->andWhere($qb->expr()->like($column->getDbFilter(), ':' . $key));
                $qb->setParameter($key, '%' . $filter['value'] . '%');
                break;
            case 'between':
                list($start, $end) = explode(' - ', $filter['value']);
                $qb->andWhere($qb->expr()->gt($column->getDbFilter(), ':' . $key . '_s'));
                $qb->setParameter($key . '_s', $start);
                $qb->andWhere($qb->expr()->lt($column->getDbFilter(), ':' . $key . '_e'));
                $qb->setParameter($key . '_e', $end);
                break;
            case 'in':
                $values = explode('|', $filter['value']);
                $qb->andWhere($qb->expr()->in($column->getDbFilter(), ':' . $key));
                $qb->setParameter($key, $values);
                break;
        }
    }
}
