/* 
	Pomocna funkce extend, ktera implementuje spravnou dedicnost prototypu.
	A je funkce konstruktor, prototyp ktere chceme zdedit do funkci konstruktoru B.
*/
function extend(A, B){
	/*
		Ulozime prototyp B do oldPrototype (fakticky pouze vytvorime dalsi referenci na ten samy objekt v pameti).
		Delame to protoze ho pak prepiseme, ale potrebujeme zachovat to, co mel driv.
	*/
	var oldPrototype = B.prototype;
	/*
		Vytvorime docasny konstruktor (prazdny) - F.
		Vytvroime ho z duvodu, ze potrebujeme mit novy objekt, ktery by mel stejny obsah jako prototyp A-konstruktoru.
		Potrebujeme prave NOVY objekt, nesmime pracovat rovnou s A.prototype - jinak by dedicnost fungovala takovym zpusobem, ze
		zmena prototypu B by ovlivnovala i A, coz ma byt jenom a pouze opacne (A ovlivnuje B, ale B neovlivnuje A).
	*/
	function F(){}
	/*
		Priradime prototypu F prototyp A.
	*/
	F.prototype = A.prototype;
	/*
		Ted' prave prichazi ta chvilka, kde vytvarime NOVY objekt (new F) se stejnym obsahem, jaky ma prototyp A.
		Ale protoze uz je to novy objekt v pameti, tak zmena B neovlivni A.
	*/
	B.prototype = new F();
	/*
		Dopisujeme do prototypu B ty vlastnosti, ktere mel na zacatku, ale ktere jsme prepsali pri nastaveni prototypu.
		To je duvod proc na zacatku jsme to ulozili do oldPrototype.
	*/
	for (var k in oldPrototype){
		B.prototype[k] = oldPrototype[k];
	}
	/*
		Return tu zadny mit nemusime z duvodu, ze kdyz pracujeme s objekty, tak reference, 
		kterou dostavame dovnitr funkce porad odkazuje na te same objekty v pameti, takze jejich zmena bude provedena hned.
	*/
}

/*
	Vytvorime tridu Clovek, do konstruktoru ulozime pouze konkretni/specificke pro kazdy novy objekt data.
*/
function Clovek(jmeno){
	this.jmeno = jmeno; // jmeno ma kazdy nove-narozeny objekt jiny, proto ho dame do konstruktoru
}
/*
	Do prototypu hodime spis "abstraktnejsi" veci, napriklad metody, ktere maji stejnou implementaci pro kazdy novy objekt.
*/
Clovek.prototype.sayHi = function(){
	console.log('Moje jmeno je ' + this.jmeno);
};
/*
	Vytvorime tridu Fotbalista (stejna logika jako trida Clovek, v podstate).
	Rozdil je ale v tom, ze pokud do Fotbalisty chceme dedit vlastnosti Cloveka, tak musime zajistit, aby
	konstruktor Fotbalisty umel prijmout i potrebne data pro konstrukci Cloveka (v nasem pripade pro vytvoreni
	Cloveka potrebujeme mit jmeno - proto musime dat i to jmeno do konstruktoru Fotbalisty).
*/
function Fotbalista(tym, jmeno){
	/*
		Pomoci metody call v podstate zadnou dedicnost neprovadime, ale musime to tu mit prave z duvodu, aby
		pri vytvoreni objektu Fotbalisty nejdrive by byl narozen prave Clovek. Ale nestaci nam pouze new Clovek, potrebujeme
		ten konstruktor Clovek spustit ve spravnem kontextu. Umoznuje nam to metoda call, ve ktere explicitne nastavime this.
		Myslenka pak zni asi tak to: "Spust' konstruktor Cloveka na instanci (zatim prazdne) Fotbalisty". Pri tom dulezity je
		chapat, ze tady nefiguruje slovicko "new", a to znamena, ze to nema nic spolecnyho s vytvorenim noveho objektu Cloveka,
		pouze aplikaci konstruktora Cloveka jako kdyby to byla obycejna funkce.
	*/
	Clovek.call(this, jmeno);
	/*
		Ted' this uz obsahuje to, co umi clovek, a navic mu nastavime fotbalovy tym.
	*/
	this.tym = tym;
}
/*
	Nastavime abstraktenjsi veci pro kazdou instanci fotbalisty stejne.
*/
Fotbalista.prototype.sayTym = function(){
	console.log('Jsem v tymu ' + this.tym);
};
/*
	Ted' mame vytvorene obe tridy a potrebujeme nastavit ten vztah dedicnosti.
	To jsme implementovali na zacatku uvnitr funkci extend, ted' ji pouze aplikujeme na nase tridy.
*/
extend(Clovek, Fotbalista);
/*
	Zkusime vytvorit fotbalistu. Bude to Petr a hraje za Spartu.
*/
var petr = new Fotbalista('Sparta', 'Petr');
/*
	Zkusime jestli vsechno funguje tak, jak ma.
*/
console.log(petr.jmeno);
console.log(petr.tym);
petr.sayHi();
petr.sayTym();