from bs4 import BeautifulSoup as soup
from os import makedirs, listdir, remove
from os.path import exists
from requests import get
from simpler import load, save
from threading import Thread
from time import sleep
from urllib.parse import urljoin
from urllib.request import urlretrieve

SEED_PATH = 'http://glslsandbox.com/?page=%d'
SOURCE_PATH = 'http://glslsandbox.com/item/%s'
IMAGE_PATH = 'thumbs/%s.png'
SCRIPT_PATH = 'scripts/%s.frag'
WORKERS = 50

def main():
	download_images()
	files = load_files()
	file_vectors = file_embeddings(files)
	save('vectors.pk', file_vectors)

def download_images():
	makedirs('thumbs', exist_ok=True)
	makedirs('scripts', exist_ok=True)

	images_to_download = []
	running = True

	def download_worker():
		while running or len(images_to_download):
			if len(images_to_download):
				image, _id = images_to_download.pop()
				try:
					script = get(SOURCE_PATH % _id).json()['code']
					urlretrieve(image, IMAGE_PATH % _id)
					with open(SCRIPT_PATH % _id, 'w', encoding='utf-8') as fp:
						fp.write(script)
				except Exception as e:
					print('[ERROR IN IMAGE %s]: %s' % (_id, e.__class__.__name__))
			else:
				sleep(1)

	i = 0
	threads = [Thread(target=download_worker) for _ in range(WORKERS)]
	[t.start() for t in threads]
	while running:
		while len(images_to_download) > 100: sleep(2)
		print('Downloading page %d. There are %d remaining images' % (i, len(images_to_download)))
		while True:
			try:
				links = soup(get(SEED_PATH % i).text, 'html.parser').select('#gallery a')
				break
			except:
				continue
		if len(links):
			for link in links:
				_id = link['href'].split('#')[1]
				if exists(SCRIPT_PATH % _id): continue
				images_to_download.append((
					urljoin(SEED_PATH, link.img['src']),
					_id
				))
		else:
			running = False
			break
		i += 1
	[t.join() for t in threads]

def load_files():
	print('Removing empty scripts')
	for f in listdir('scripts'):
		if not len(load('scripts/%s' % f)):
			remove('scripts/%s' % f)
	print('Removing scripts without thumb and vice versa')
	scripts = {f.rsplit('.', 1)[0] for f in listdir('scripts')}
	thumbs = {f.rsplit('.', 1)[0] for f in listdir('thumbs')}
	print(len(scripts), len(thumbs), len(scripts - thumbs), len(thumbs - scripts))
	for script in scripts - thumbs:
		remove('scripts/%s.frag' % script)
	for thumb in thumbs - scripts:
		remove('thumbs/%s.png' % thumb)
	print('Loading scripts')
	return {f: load('scripts/%s.frag' % f) for f in scripts & thumbs}

def file_embeddings(files):
	pass  # TODO

if __name__ == '__main__':
	main()