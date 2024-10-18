<?php

declare(strict_types=1);

namespace Drupal\Tests\base\Kernel;

use Drupal\KernelTests\KernelTestBase;
use Drupal\base_test\Plugin\QueueWorker\BaseQueueWorker;

/**
 * Test description.
 *
 * @group base_test
 */
final class BaseTestTest extends KernelTestBase {

  /**
   * {@inheritdoc}
   */
  protected static $modules = ['base_test', 'dblog'];

  /**
   * {@inheritdoc}
   */
  public function setUp(): void {
    parent::setUp();

    $this->installSchema('dblog', 'watchdog');
    $this->installConfig(['dblog']);
  }

  /**
   * Tests something.
   */
  public function testBaseTest(): void {
    $plugin = BaseQueueWorker::create($this->container, [], '', []);
    $plugin->processItem([
      'user' => 'anonymous',
      'uid' => 0,
      'op' => 'Operation',
      'entity' => 'Test',
      'timestamp' => time(),
    ]);

    $this->assertTrue(TRUE);
  }

}
