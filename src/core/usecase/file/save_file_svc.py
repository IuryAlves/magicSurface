# coding: utf-8
import boto
from boto.s3.key import Key
from src.core.models.configs.model import Config
from src.core.models.file.model import File, IMAGE
from src.core.models.layer.model import Layer
from src.core.usecase import MSException

__author__ = 'bustamante'

img_exts = ['png', 'jpg', 'jpeg']


def save(app_data, layer_id, field_storage):
    layer = Layer.get_by_id(int(layer_id))

    if layer is None:
        raise MSException(u'LayerId inválido')

    file_type = _get_file_type(field_storage)
    if file_type == IMAGE:
        _s3_save(field_storage)
        instance = _get_image_instance(field_storage)
    else:
        raise MSException(u'Tipo de arquivo invalido, verifique se ele é: %s' % ', '.join(img_exts))

    instance.layer = layer.key
    instance.app_id = app_data['app']['id']
    instance.put()

    return instance.to_dict_json()


def _get_file_type(field_storage):
    _type = field_storage.type
    file_name = field_storage.filename

    type_ext = _type.split('/')[-1].lower()
    name_ext =  file_name.split('.')[-1].lower()

    if type_ext in img_exts and name_ext in img_exts:
        return IMAGE
    raise MSException(u'Tipo de arquivo invalido, verifique se ele é: %s' % ', '.join(img_exts))


def _s3_save(field_storage):
    access_id = Config.get('AWS_ACCESS_KEY_ID')
    secret_access = Config.get('AWS_SECRET_ACCESS_KEY')
    bucket_name = Config.get('BUCKET_NAME')

    conn = boto.connect_s3(access_id, secret_access)
    bucket = conn.get_bucket(bucket_name)
    k = Key(bucket)
    k.key = field_storage.filename
    k.set_contents_from_file(field_storage.file)
    k.make_public()


def _get_image_instance(field_storage):
    bucket_name = Config.get('BUCKET_NAME')
    file_instance = File()
    file_instance.kind = IMAGE
    file_instance.name = field_storage.filename
    file_instance.size = field_storage.bufsize
    file_instance.link = 'https://s3-sa-east-1.amazonaws.com/%s/%s' % (bucket_name, field_storage.filename)
    return file_instance
