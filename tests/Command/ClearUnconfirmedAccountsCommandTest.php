<?php

namespace App\Tests\Command;

use App\DataFixtures\UserFixtures;
use Liip\TestFixturesBundle\Test\FixturesTrait;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\Console\Tester\CommandTester;

class ClearUnconfirmedAccountsCommandTest extends KernelTestCase
{
    use FixturesTrait;

    public function testExecute()
    {
        $this->loadFixtures([UserFixtures::class]);

        $kernel = static::createKernel();
        $application = new Application($kernel);

        $command = $application->find('app:clear-unconfirmed-accounts');
        $commandTester = new CommandTester($command);
        $commandTester->execute([
            'datetime' => '-1 week'
        ]);

        $output = $commandTester->getDisplay();
        $this->assertStringContainsString('Deleted account: demoUser-1@localhost.dev', $output);
    }
}
