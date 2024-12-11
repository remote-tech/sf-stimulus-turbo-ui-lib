<?php

namespace RemoteTech\SfStimulusTurboUI\Service\Listing;

class SortableColumn extends Column
{
    const string ARROW_UP = 'bi-arrow-up';

    const string ARROW_DOWN = 'bi-arrow-down';

    /**
     * @var array<string, array<string, string|null>|int>
     */
    private array $sortingQueryString = [];

    private string $arrow = 'bi-arrow-down-up';

    public function __construct()
    {
        $this->sortable = true;
    }

    /**
     * @return array<string, array<string, string|null>|int>
     */
    public function getSortingQueryString(): array
    {
        return $this->sortingQueryString;
    }

    /**
     * @param array<string, array<string, string|null>|int> $sortingQueryString
     */
    public function setSortingQueryString(array $sortingQueryString): SortableColumn
    {
        $this->sortingQueryString = $sortingQueryString;
        return $this;
    }

    public function getArrow(): string
    {
        return $this->arrow;
    }

    public function setArrow(string $arrow): SortableColumn
    {
        $this->arrow = $arrow;
        return $this;
    }

    /**
     * @param array<string, string> $activeSorting
     * @param array<string, string> $filters
     */
    public function generateColumnSorting(
        array $activeSorting, array $filters = [], int $page = 1, int $perPage = 0
    ): void
    {
        if (isset($activeSorting[$this->dbId])) {
            if ($activeSorting[$this->dbId] != 'desc') {
                $sorting = 'desc';
                $this->arrow = self::ARROW_UP;
            } else {
                $sorting = null;
                $this->arrow = self::ARROW_DOWN;
            }
        } else {
            $sorting = 'asc';
        }

        $sortQS = array_merge($activeSorting, [$this->dbId => $sorting]);

        $this->sortingQueryString = array_merge(
            ['sort' => $sortQS],
            ['filters' => $filters],
            ['items' => $perPage, 'page' => $page]
        );
    }
}
