<?php
namespace AppBundle\Twig;

use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;

class AssetVersionExtension extends AbstractExtension
{
    private $appDir;
    private $domain;
    private $isDev;
    private $manifest;

    /**
     * AssetVersionExtension constructor.
     * @param $appDir
     * @param $domain
     * @param $environment
     */
    public function __construct($appDir, $domain, $environment)
    {
        $this->appDir = $appDir;
        $this->domain = $domain;
        $this->isDev = $environment === 'dev';
    }

    public function getFilters()
    {
        return [
            new \Twig_SimpleFilter('asset_version', [$this, 'getAssetVersion']),
            new \Twig_SimpleFilter('asset_stylesheet', [$this, 'getStylesheet']),
            new \Twig_SimpleFilter('asset_javascript', [$this, 'getScript']),
        ];
    }

    public function getFunctions()
    {
        return [
            new \Twig_SimpleFunction('renderHeadAssets', [$this, 'renderHeadAssets']),
            new \Twig_SimpleFunction('renderJQueryAssets', [$this, 'renderJQueryAssets']),
            new \Twig_SimpleFunction('renderFooterAssets', [$this, 'renderFooterAssets']),

            new \Twig_SimpleFunction('renderAdminHeadAssets', [$this, 'renderAdminHeadAssets']),
            new \Twig_SimpleFunction('renderAdminFooterAssets', [$this, 'renderAdminFooterAssets']),

            new \Twig_SimpleFunction('renderExtranetHeadAssets', [$this, 'renderExtranetHeadAssets']),
            new \Twig_SimpleFunction('renderExtranetFooterAssets', [$this, 'renderExtranetFooterAssets']),

            new \Twig_SimpleFunction('renderPersonalisedAssets', [$this, 'renderPersonalisedAssets']),
        ];
    }

    public function getAssetVersion($filename)
    {
        if (!$this->isDev) {
            $manifestPath = $this->appDir . '/../web/dist/v2/rev-manifest.json';
            $paths = json_decode(file_get_contents($manifestPath), true);

            return $paths[$filename];
        }
    }

    public function getStylesheet($file)
    {
        $file = $this->getAssetVersionV2($file, 'css');
        return '<link rel="stylesheet" href="'.$file.'">';
    }

    public function getScript($file)
    {
        $file = $this->getAssetVersionV2($file, 'js');
        return '<script src="'.$file.'"></script>';
    }

    public function renderHeadAssets()
    {
        // Styles are embedded in the JS on development, so no need to have style tags for them
        if ($this->isDev) {
            return "";
        }

        $tags = [];

        $tags[] = $this->getStylesheet('vendor');
        $tags[] = $this->getStylesheet('frontend-core');

        return implode("\n", $tags);
    }

    public function renderFooterAssets()
    {
        $tags = [];

        if (!$this->isDev) {
            $tags[] = $this->getScript('vendor');
        }

        $tags[] = $this->getScript('frontend');

        return implode("\n", $tags);
    }

    public function getAssetVersionV2($filename, $fileType)
    {
        if ($this->isDev) {
            // Get from webpack
            return '//www.'. $this->domain .':8401/dist/v2/' . $filename . '.' . $fileType;
        }

        if ($this->manifest == null) {
            $manifestPath = $this->appDir . '/../web/dist/v2/rev-manifest.json';
            $this->manifest = json_decode(file_get_contents($manifestPath), true);
        }

        // If on production, load from the built manifest file
        return $this->manifest[$filename][$fileType];
    }

    public function getName()
    {
        return 'asset_version';
    }
}
