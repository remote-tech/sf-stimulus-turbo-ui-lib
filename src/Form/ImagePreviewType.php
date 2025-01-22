<?php

namespace RemoteTech\SfStimulusTurboUI\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\FormView;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ImagePreviewType extends AbstractType
{
    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => null,
            'preview_image_path' => null,
        ]);
    }

    public function buildView(FormView $view, FormInterface $form, array $options)
    {
        $view->vars['preview_image_path'] = $options['preview_image_path'];
    }

    public function getParent(): string
    {
        return FileType::class; // Inherit behavior from FileType
    }

    public function getBlockPrefix(): string
    {
        return 'image_preview';
    }
}