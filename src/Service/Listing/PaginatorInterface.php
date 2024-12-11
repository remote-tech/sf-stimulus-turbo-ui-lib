<?php

namespace RemoteTech\SfStimulusTurboUI\Service\Listing;

use Pagerfanta\Pagerfanta;

interface PaginatorInterface
{
    public const int ITEMS_PER_PAGE = 100;

    /**
     * @param array<string, string> $filters
     * @param array<string, string> $sorting
     * @return Pagerfanta<mixed>
     */
    public function getPaginatedData(int $page, int $perPage, array $filters = [], array $sorting = []): Pagerfanta;
}