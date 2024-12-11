<?php

namespace RemoteTech\SfStimulusTurboUI\Service;

use Sqids\Sqids;


class SqidService
{

    private Sqids $sqid;

    public function __construct()
    {
        $this->sqid = new Sqids(alphabet: 'abcdef0123456789', minLength: 8);
    }

    public function encode(int $value): string
    {
        return $this->sqid->encode([$value]);
    }

    public function decodeSingleId(string $id): int
    {
        return (int)$this->sqid->decode($id)[0];
    }
}
