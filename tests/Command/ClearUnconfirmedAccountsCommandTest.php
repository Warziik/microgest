<?php

namespace App\Tests\Command;

use App\DataFixtures\UserFixtures;
use Liip\TestFixturesBundle\Services\DatabaseToolCollection;
use Liip\TestFixturesBundle\Services\DatabaseTools\AbstractDatabaseTool;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\Console\Tester\CommandTester;

class ClearUnconfirmedAccountsCommandTest extends KernelTestCase
{
    /** @var AbstractDatabaseTool */
    protected $databaseTool;

    protected function setUp(): void
    {
        parent::setUp();

        static::bootKernel();
        $this->databaseTool = static::getContainer()->get(DatabaseToolCollection::class)->get();
        $this->databaseTool->loadFixtures([UserFixtures::class]);
    }

    public function testExecute()
    {
        $kernel = static::createKernel();
        $application = new Application($kernel);

        $command = $application->find('app:clear-unconfirmed-accounts');
        $commandTester = new CommandTester($command);
        $commandTester->execute([
            'datetime' => '-1 week',
        ]);

        $output = $commandTester->getDisplay();
        $this->assertStringContainsString('Deleted account: demoUser-1@localhost.dev', $output);
    }
}
