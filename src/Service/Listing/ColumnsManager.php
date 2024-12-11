<?php

namespace RemoteTech\SfStimulusTurboUI\Service\Listing;


class ColumnsManager implements \IteratorAggregate
{
    /** @var array<string,Column>  */
    private array $columns = [];

    public function __construct(
        private bool $hasActionsColumn = false
    )
    {
    }

    public function addColumn(string $key): Column
    {
        $this->columns[$key] = new Column();
        return $this->columns[$key];
    }

    public function removeColumn(string $key): self
    {
        if (isset($this->columns[$key])) {
            unset($this->columns[$key]);
        }
        return $this;
    }

    public function addSortableColumn(string $key): Column
    {
        $this->columns[$key] = new SortableColumn();
        return $this->columns[$key];
    }

    public function hasActionsColumn(): bool
    {
        return $this->hasActionsColumn;
    }

    public function setHasActionsColumn(bool $hasActionColumn): self
    {
        $this->hasActionsColumn = $hasActionColumn;
        return $this;
    }

    /**
     * @return array<string, Column>
     */
    public function getColumns(): array
    {
        return $this->columns;
    }

    public function getColumn(string $key): ?Column
    {
        return $this->columns[$key];
    }

    public function getIterator(): \ArrayIterator
    {
            return new \ArrayIterator($this->columns);
    }
}
