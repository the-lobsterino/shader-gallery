#ifdef GL_ES
precision mediump float;
#endif

void render()
{
	gl_FragColor += 0.9;
}

void main()
{
	for(int c = 1; c < int(9e9); c++) {
		render();
	}
}