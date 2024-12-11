<?php

namespace RemoteTech\SfStimulusTurboUI\Service\Listing;

class Column
{
    public const string TYPE_DATE = 'date';
    public const string TYPE_DATE_STRING = 'date_string';
    public const string TYPE_DATETIME = 'datetime';
    public const string TYPE_TEXT = 'text';
    public const string TYPE_TEXT_BOLD = 'text_bold';
    public const string TYPE_LINK = 'link';
    public const string TYPE_CHECKBOX = 'checkbox';
    const TYPE_BROWSER = 'browser';
    const TYPE_DAYS_PASSED = 'days_passed';
    const TYPE_OS = 'os';
    const TYPE_COUNTRY = 'country';


    public const string DATA_TYPE_STRING = 'string';
    public const string DATA_TYPE_INT = 'int';
    public const string DATA_TYPE_DATE = 'date';
    public const string DATA_TYPE_ENUM = 'enum';

    protected ?string $dbId = null;
    protected ?string $dbFilter = null;
    protected ?string $label = null;
    protected bool $sortable = false;
    protected bool $listIndex = false;
    protected bool $isEncoded = false;
    protected bool $isFilter = false;
    protected bool $isHiddenFilter = false;
    protected array $filterOptions = [];

    protected string $link = '#';

    protected string $type = self::TYPE_TEXT;
    protected string $dataType = self::DATA_TYPE_STRING;

    /** @var array<string, array<string, string|bool>> */
    private array $linkParams = [];
    private ?string $htmlFile = null;

    private ?string $cssClass = null;

    // if there is a value that requires mapping, set this property as an array<value, displayedLabel>
    /** @var array<string|int, string|int>|null  */
    private ?array $mappingOptions = null;

    public function getDbId(): ?string
    {
        return $this->dbId;
    }

    public function setDbId(?string $dbId): Column
    {
        $this->dbId = $dbId;
        return $this;
    }

    public function getLabel(): ?string
    {
        return $this->label;
    }

    public function setLabel(?string $label): Column
    {
        $this->label = $label;
        return $this;
    }

    public function isSortable(): bool
    {
        return $this->sortable;
    }

    public function setSortable(bool $sortable): Column
    {
        $this->sortable = $sortable;
        return $this;
    }

    public function isListIndex(): bool
    {
        return $this->listIndex;
    }

    public function asListIndex(): Column
    {
        $this->listIndex = true;
        return $this;
    }

    public function getType(): string
    {
        return $this->type;
    }

    public function setType(string $type): Column
    {
        $this->type = $type;
        return $this;
    }

    public function getLink(): string
    {
        return $this->link;
    }

    public function setLink(string $link): Column
    {
        $this->link = $link;
        return $this;
    }

    /**
     * @return array<string, array<string, string|bool>>
     */
    public function getLinkParams(): array
    {
        return $this->linkParams;
    }

    public function addLinkParams(string $key, string $value, bool $encoded = false): Column
    {
        $this->linkParams[$key] = [
            'value' => $value,
            'encoded' => $encoded
        ];
        return $this;
    }

    public function isEncoded(): bool
    {
        return $this->isEncoded;
    }

    public function setIsEncoded(bool $isEncoded): Column
    {
        $this->isEncoded = $isEncoded;
        return $this;
    }

    public function getDataType(): string
    {
        return $this->dataType;
    }

    public function setFilterType(string $dataType): Column
    {
        $this->dataType = $dataType;
        return $this;
    }

    public function isFilter(): bool
    {
        return $this->isFilter;
    }

    public function setIsFilter(bool $isFilter): Column
    {
        $this->isFilter = $isFilter;
        return $this;
    }

    public function getDbFilter(): ?string
    {
        return $this->dbFilter;
    }

    public function setDbFilter(?string $dbFilter): Column
    {
        $this->dbFilter = $dbFilter;
        return $this;
    }

    public function isHiddenFilter(): bool
    {
        return $this->isHiddenFilter;
    }

    public function setIsHiddenFilter(bool $isHiddenFilter): Column
    {
        $this->isHiddenFilter = $isHiddenFilter;
        return $this;
    }

    public function setHtmlFile(?string $filename): Column
    {
        $this->htmlFile = $filename;
        return $this;
    }

    public function getHtmlFile(): ?string
    {
        return $this->htmlFile;
    }

    public function getCssClass(): ?string
    {
        return $this->cssClass;
    }

    public function setCssClass(?string $cssClass): Column
    {
        $this->cssClass = $cssClass;
        return $this;
    }

    /**
     * @return array<string|int, string|int>|null
     */
    public function getMappingOptions(): ?array
    {
        return $this->mappingOptions;
    }

    /**
     * @param array<string|int, string|int>|null $mappingOptions
     */
    public function setMappingOptions(?array $mappingOptions): Column
    {
        $this->mappingOptions = $mappingOptions;
        return $this;
    }

    public function setEnumFilterOptions(array $options): Column
    {
        $this->filterOptions = $options;
        return $this;
    }

    public function getEnumFilterOptions(): string
    {
        $processedOptions = [];
        foreach ($this->filterOptions as $key => $name) {
            $processedOptions[] = $key . ':' . $name;

        }
        return implode('|', $processedOptions);
    }
}
