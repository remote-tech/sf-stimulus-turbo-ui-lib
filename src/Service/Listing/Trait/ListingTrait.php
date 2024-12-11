<?php

namespace RemoteTech\SfStimulusTurboUI\Service\Listing\Trait;

use RemoteTech\SfStimulusTurboUI\Service\Listing\AbstractListing;
use RemoteTech\SfStimulusTurboUI\Service\Listing\PaginatorInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\UX\Turbo\TurboBundle;

trait ListingTrait
{
    /**
     * @param array<string, string> $filters
     */
    public function getListingDataStream(
        Request         $request,
        AbstractListing $service,
        array           $filters = [],
        int             $page = 1,
        string          $viewFile = '@rt_sf_ui_lib/listing/table_rows_stream.html.twig'
    ): Response
    {
        $items = $request->query->getInt('items', PaginatorInterface::ITEMS_PER_PAGE);
        $queryString = $request->query->all();

        /** @var array<string, string> $sorting */
        $sorting = $queryString['sort'] ?? [];
        $request->setRequestFormat(TurboBundle::STREAM_FORMAT);

        $results = $service->getPaginatedData($page, $items, $filters, $sorting);
        if (count($results) > 0) {
            return $this->render($viewFile, [
                'items' => $results,
                'columnsManager' => $service->getColumnsManager(),
            ]);
        } else {
            return $this->render('@rt_sf_ui_lib/listing/no_results_stream.html.twig', [
                'items' => $results,
            ]);
        }
    }
}