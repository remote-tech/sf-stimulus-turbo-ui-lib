<?php

namespace RemoteTech\SfStimulusTurboUI\Service\Listing;

use RemoteTech\SfStimulusTurboUI\TwigExtension\DateTimeHelper;
use Doctrine\ORM\QueryBuilder;
use Pagerfanta\Adapter\ArrayAdapter;
use Pagerfanta\Pagerfanta;

abstract class AbstractListing implements PaginatorInterface
{
    /** @var array<string, string> */
    protected array $filters = [];

    /** @var array<string, array> */
    protected array $dynamicFilters = [];

    /** @var array<string, string> */
    protected array $sorting = [];

    private ColumnsManager $columnsManager;

    public function __construct(bool $hasActionColumn, private readonly DoctrineFilter $doctrineFilter)
    {
        $this->columnsManager = new ColumnsManager($hasActionColumn);
        $this->addColumns();
    }

    /**
     * @return array<string, array<string, array<string, array<string, string>|int>|bool|string>>
     */
    abstract public function generateMainFilters(int $page, int $items): array;

    public function getColumnsManager(): ColumnsManager
    {
        return $this->columnsManager;
    }

    abstract protected function getQueryBuilder(): QueryBuilder;

    abstract protected function applyFilters(QueryBuilder $queryBuilder): void;
    abstract protected function addColumns(): void;

    public function getPaginatedData(int $page, int $perPage, array $filters = [], array $sorting = []): Pagerfanta
    {
        $baseFilters = [];
        $dynamicFilters = [];

        // TODO: Use dto condition
        foreach ($filters as $key => $filter) {
            if (is_array($filter) && isset($filter['op'])) {
                $dynamicFilters[$key] = $filter;
                continue;
            }

            $baseFilters[$key] = $filter;
        }

        $this->filters = $baseFilters;
        $this->dynamicFilters = $dynamicFilters;
        $this->sorting = $sorting;

        $queryBuilder = $this->getQueryBuilder();
        $pager = new Pagerfanta(new ArrayAdapter($queryBuilder->getQuery()->getArrayResult()));

        $pager->setMaxPerPage(($perPage > 0) ? $perPage : self::ITEMS_PER_PAGE);

        $pager->setNormalizeOutOfRangePages(true);
        $pager->setCurrentPage($page);

        return $pager;
    }

    public function applyDynamicFilters(QueryBuilder $queryBuilder): void
    {
        $this->doctrineFilter->addFilters($this->dynamicFilters, $this->getColumnsManager(), $queryBuilder);
    }

    /**
     * @param array<string, string> $filters
     * @param array<string, string> $sorting
     * @param array<int, string> $colOrder
     * @param array<string, string> $colVisible
     * @return array<string, array<int|string, bool|float|int|string|null>>
     * @throws \Exception
     */
    public function getCsvExportData(array $filters = [], array $sorting = [], array $colOrder = [], array $colVisible = []): array
    {
        $baseFilters = [];
        $dynamicFilters = [];

        // TODO: Use dto condition
        foreach ($filters as $key => $filter) {
            if (is_array($filter) && isset($filter['op'])) {
                $dynamicFilters[$key] = $filter;
                continue;
            }

            $baseFilters[$key] = $filter;
        }

        $this->filters = $baseFilters;
        $this->dynamicFilters = $dynamicFilters;

        $this->sorting = $sorting;
        $manager = $this->getColumnsManager();

        // remove the columns that are not visible on the FE to not query them, and not add in the export
        // TODO: This does not seem to work as expected (when visible columns is empty it brings all)
        if (!empty($colVisible)) {
            foreach ($manager->getColumns() as $key => $columnObj) {
                if (!in_array($key, $colVisible) && $manager->getColumn($key)->getType() !== Column::TYPE_CHECKBOX) {
                    $manager->removeColumn($key);
                }
            }
        }
        /** @var array<string, string> $rawResults */
        $rawResults = $this->getQueryBuilder()->getQuery()->getArrayResult();
        return $this->processExportResults($rawResults, $colOrder);
    }

    /**
     * @param array<string, string> $rawResults
     * @param array<int, string> $colOrder
     * @return array<string, array<int|string, bool|float|int|string|null>>
     * @throws \Exception
     */
    protected function processExportResults(array $rawResults, array $colOrder): array
    {
        $results = [];
        $orderdHeaders = [];

        if (empty($colOrder)) {
            $colOrder = array_keys(reset($rawResults));
        }

        foreach ($colOrder as $col) {
            if (!$this->columnsManager->getIterator()->offsetExists($col)) {
                continue;
            }

            if ($this->columnsManager->getColumn($col)->getType() === Column::TYPE_CHECKBOX) {
                continue;
            }

            /** @phpstan-ignore-next-line  */
            $orderdHeaders[] = $this->columnsManager->getColumn($col)->getLabel();
        }

        $results['headers'] = $orderdHeaders;
        // order the columns based on the order received from UI
        /** @var array<string, string|object> $row */
        foreach ($rawResults as $key => $row) {
            $results[$key] = [];
            foreach ($colOrder as $col) {
                if (!array_key_exists($col, $row)) {
                    continue;
                }

                if ($this->columnsManager->getColumn($col)->getType() === Column::TYPE_CHECKBOX) {
                    continue;
                }

                if ($row[$col] instanceof \DateTime) {
                    $row[$col] = DateTimeHelper::formatDateTime($row[$col]);
                }
                $results[$key][$col] = $row[$col];
            }
        }

        return $results;
    }

    protected function generateSelect(): string
    {
        $selectList = [];
        foreach ($this->getColumnsManager()->getColumns() as $key => $column) {
            $selectList[] = $column->getDbId() . ' as ' . $key;
        }

        return implode(',', $selectList);
    }

    /**
     * @return array<int, string>
     */
    public function parseDateRange(string $filter): array
    {
        return explode(' - ', $filter);
    }

    protected function applySorting(QueryBuilder $queryBuilder): void
    {
        foreach ($this->sorting as $field => $order) {
            $queryBuilder->orderBy($field, strtoupper($order));
        }
    }
}
