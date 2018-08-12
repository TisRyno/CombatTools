<?php


if (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https') {
    $_SERVER['HTTPS'] = 'on';
}

// Cloudflare headers may contain the users real ip address
foreach (['HTTP_CF_CONNECTING_IP','HTTP_X_FORWARDED_FOR'] as $headerName) {
    if (isset($_SERVER[$headerName]) && strlen($_SERVER[$headerName]) !== 0) {
        // Found one!
        $possibleIp = $_SERVER[$headerName];
        if ($possibleIp && strlen($possibleIp) >= 14 && strlen($possibleIp) <= 29 &&  strpos($possibleIp, '::ffff:') === 0 &&
            filter_var(($truncatedIp = substr($possibleIp, 7)), FILTER_VALIDATE_IP, FILTER_FLAG_IPV4) !== false) {
            $possibleIp = $truncatedIp;
        }

        $_SERVER['REMOTE_ADDR'] = $possibleIp;
        break;
    }
}

use Symfony\Component\Debug\Debug;
use Symfony\Component\HttpFoundation\Request;

// If you don't want to setup permissions the proper way, just uncomment the following PHP line
// read https://symfony.com/doc/current/setup.html#checking-symfony-application-configuration-and-setup
// for more information
//umask(0000);

require __DIR__.'/../vendor/autoload.php';
Debug::enable();

$kernel = new AppKernel('dev', true);
if (PHP_VERSION_ID < 70000) {
    $kernel->loadClassCache();
}
$request = Request::createFromGlobals();
$response = $kernel->handle($request);
$response->send();
$kernel->terminate($request, $response);

