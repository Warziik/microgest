<?php

namespace App\Command;

use App\Repository\UserRepository;
use DateTime;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class ClearUnconfirmedAccountsCommand extends Command
{
    private const DEFAULT_DATETIME_VALUE = '-1 week';

    protected static $defaultName = 'app:clear-unconfirmed-accounts';

    public function __construct(private UserRepository $userRepository)
    {
        parent::__construct();
    }

    protected function configure()
    {
        $this
            ->setDescription('Clear all unconfirmed accounts of the database.')
            ->addArgument('datetime', InputArgument::OPTIONAL);
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $datetime = $input->getArgument('datetime');
        if (is_null($datetime)) {
            $datetime = new DateTime(self::DEFAULT_DATETIME_VALUE);
        } else {
            $datetime = new DateTime($datetime);
        }

        $output->writeln('Cleaning unconfirmed accounts...');

        [$isSuccess, $deletedUsers] = $this->userRepository->clearUnconfirmedAccounts($datetime);

        if ($isSuccess) {
            foreach ($deletedUsers as $deletedUser) {
                $output->writeln(
                    sprintf(
                        'Deleted account: <comment>%s</comment>',
                        $deletedUser->getUsername()
                    )
                );
            }

            return Command::SUCCESS;
        }

        return Command::FAILURE;
    }
}
