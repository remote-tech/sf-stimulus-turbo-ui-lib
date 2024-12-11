<?php

namespace RemoteTech\SfStimulusTurboUI\Service\Listing\Trait;

use RemoteTech\SfStimulusTurboUI\Service\Listing\AbstractListing;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

trait ExportTrait
{
    /**
     * @param array<string, string|array<string, string>> $queryString
     */
    public function exportCsvAction(AbstractListing $service, array $queryString, string $filename = 'export', $customFilters = []): Response
    {
        try {
            /** @var array<string, string> $filters */
            $filters = $queryString['filters'] ?? [];

            $filters = array_merge($filters, $customFilters);

            /** @var array<string, string> $sort */
            $sort = $queryString['sort'] ?? [];
            /** @var array<int, string> $colOrder */
            $colOrder = $queryString['colOrder'] ?? [];
            /** @var array<string, string> $colVisible */
            $colVisible = $queryString['colVisible'] ?? [];
            $results = $service->getCsvExportData(
                $filters,
                $sort,
                $colOrder,
                $colVisible
            );
        } catch (\Exception $e) {
            return new Response($e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '.csv"',
            'Content-Security-Policy', 'upgrade-insecure-requests'
        ];
        return new StreamedResponse(
            function () use ($results) {
                $handle = fopen('php://output', 'w');
                if (!$handle) {
                    throw new \RuntimeException('Failed to generate export file');
                }
                foreach ($results as $row) {
                    fputcsv($handle, $row);
                }
                fclose($handle);
            },
            200,
            $headers
        );
    }
}