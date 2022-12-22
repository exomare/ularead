=================================
Sistema di Direcotry 
=================================
Scegliere o creare una  direcory, da utilizzare come directory base.
Per convenzione sarà sempre indicata come
BASEDIR/
In tutte le operazioni faremo riferimento questa directory.
Directory utilizzate nell’applicazione

BASEDIR/ula
  directory dell'applicazione da cui lanciare i comandi

BASEDIR/ula/static
   Contiene tutti gli elementi per la gestione nel browser

BASEDIR/ula/static/cfg
   Contiene tabelle di configurazione

BASEDIR/ula/text
   Contiene i testi originali 

BASEDIR/ula/text_src
   Contiene i testi divisi sistemati
   ed eventualmente divisi in righe
   da utilizzare per la produzione dei dati

BASEDIR/ula/data
   Contiene i dai dei test 
   form: il dizionario del testo
   token: la lista di tutte le parole del testo
   Es.
   pinocchio.txt => pinocchio.form.csv
                     pinocchio.token.csv

BASEDIR/ula/data_corpus
contiene i dati del corpus
corpus.form.csv
corpus_omogr.json

BASEDIR/ula/data_back
copie di sicurezz gestite automaticamente ad ogni 
salvatggio dal browse
contiene per ogmi data
BASEDIR/ula/data_back/aammgg
contirne i files nella forma
nomefile.form_aammgg_hh.csv
nomefile.token_aammgg_hh.csv
es.
Salvataggio eseguito il 10/11/2022 dla 13.00 al 13.59
BASEDIR/ula/data_back/110112/kafka_110112_13.csv
BASEDIR/ula/data_back/110112/kafka_110112_13.form


BASEDIR/ula/data_corpus_back
copie di sicurezz gestite automaticamente ad ogni 
aggiornamento del corpus
contiene per ogmi data
BASEDIR/ula/data_corpus_back/aammgg
contirne i files nella forma
corpus.form_aammgg_hh.csv

=============================
Tabelle di  Configurazione 
============================
- Spostarsi nella dir BASEDIR/ula/static/cfg
- Settare pos.csv 
          msd.csv 
          phon.txt 
- Spostarsi nella dir BASEDIR/ula
- lanciare 
posmsd2json.py
-> salva nella dir BASEDIR/ula/static/cfg
   il file  
   pos_msd.json 
   utilizzato per  POS e MSD

====================================================
Aggiunta di un testo e dei suoi dati 
===================================================
textadd.py <text_path>

Per default il testo si trova nella dir text,
ma può trovarsi in qualsiasi dir.
Il comando esegue lancia:
textcleaner.py
texttodata.py
es.
textadd.py ./text/fie_name.txt
legge 
   ./text/file_nametxt
TextCleaner pulisce dati e 
salva
   ./text_src/file_name.txt
legge 
   ./text_src/file_nametxt
Text2Data  estra i dati
salva 
./data/file_name.form.csv
./data/file_name.token.csv
salva
./data/text_list.txt

ATTENZIONE !!
  Sovrascrive i dati di una eventuale elaborazione 
  PRECEDENTE
  dello stesso testo.

==============================
Lancio del Server
=============================
- posizionati nella dir BASEDIR/ula
- digitare 
ulaserver.py -p 8080
  si possono usare porte diverse.
  Attenzione la porta 80  può entrare in conflitto  con quella del 
  server di sistema.
  
===========================
Lancio dal browser
==========================  
- digitare l'url:

http://127.0.0.1:8080

Si possono usare porte diverse.
Nel caso sia possibile utilizzare la poeta 80  
si può usare l'url:

http://127.0.0.1   
      
========================
Gestione dello Store 
========================
Per ogni postazione dalla quale si lancia il browser
è disponibile una memoria locale denominata Store.
Tale memoria è accessibile solo attraverso il browser,
ma permette la permanenza dei dati fra una sessione e l'altra.
E' molto veloce e garantisce la permanenza dei dati anche
a fronte di una caduta della connessione internet o spegnimento
del server.

Durante il lavoro ogni singola operazione è immediatamente
salvati nello Store.
Questo significa che chiudendo il browser o spegnendo il sistema
i dati sono salvati localmente.
Al successivo collegamento saranno disponibili.
Questo vale sia lavorando in locale (http:/localistico) che 
in remoto.

Save
Per salvare i dati sul server, nella dir BASEDIR/ula/data bisogna 
utilizzare l'opzione Save.
I dati vengono salvati nlla directory BASEDIR/data

Load
Con l'opzione Load vengono letti i dati dal server dalla direcory 
BASEDIR/ula/data.
I dati letti sovrascrivono quelli contenuti nello Store.

ATTENZIONE !! 
Se si vogliono mantenere i dati dello Store bisogna eseguire
Save prima di Load.
Quindi Load server quando si vuole tornare ad una situazione
precedente (quella dell'ultimo salvataggio effettuato con Save)
eliminando le operazioni fatte successivamente memorizzate nello
Store


**** COMANDI OPZIONALI  PER USO PARTICOLARE *******

===============================
Sistemazione  Testi 
==============================
textcleaner.py 
optional arguments:
  -h, --help  show this help message and exit
  -i          -i <file.txt>
  -o          -o <fileclean.txt>
  -l          -l <line length> -1:not split 0:paragraph >0:rows (default -1)

Sistema puteggiature
rimuove spazi bianche maggiori di 1
elimina spazi ad inizio e fine riga
il parametro l (opzionale):

-1) lascia la separazione originale
0 ) separa per paragrafi
>0) separa per lunghezza riga

-----------------------------------
File testo continui
-----------------------------------
- posizionarsi nella dir ./text_line
- lannciare

textcleaner.py -i ./text_line/<name_file> -o ./text_src/</name_file> -l 70

il file e sistemato, diviso in righe e traferito

./text_line/name_file.txt => ./text_src/name_file.txt
------------------------------
File testo a righe
------------------------------
- posizionarsi nella dir ./text_lb
- lannciare

textcleaner.py -i ./text_line/<name_file> -o ./text_src/</name_file> 

./text_lb/name_file.txt => ./text_src/name_file.txt

Se si vuole una nuva divisione in rughe
text_cleaner.py -i ./text_line/<name_file> -o ./text_src/</name_file> -l 70

./text_lb/name_file.txt => ./text_src/name_file.txt


=================================
BROWSER COMANDI
=================================
update copus
aggiorna solo le form per le quali
in text  
lemma!='' and pos !=''
se il campo di corpus non è vuoto lo sovrascrive
stampa la lista dei campi sovrascritti

update text
aggiorna text per tutti i valori di corpus

=================================================
AGGIOORNAMENTI GLOBALI 
================================================
corpusfromalltext.py
Aggiorna il corpus con i dati di tutti i test 

corpustoalltext.py
Aggiorna tutti i test con i dati del corpus


=================================================
CORREZIONE TESTO 
Comandi da eseguire per adegfuare i datri ad un testo modificato
================================================
A)
dal browser eseguire i seguenti comandi:

1) save data

2) update corpus
--------------
B)
lanciare
textupd.py <text_path>

sono eseguite le seguenti azioni

1) muove files
   data/name.token.csv => tmp/name.token1.csv
   data/name.form.csv  => tmp/name.form1.csv

2) elabora 
   data/name.token.csv
   data/name.form.csv

3) muove files
   data/name.token.csv => tmp/name.token2.csv
   
4) elabora 
   tmp/name.token3.csv
   tmp/name.form3.csv

5) muove file
   tmp/name.token3.csv => data/name.token.csv
   tmp/name.form3.csv  => data/name.form.csv
   stampa lista disamb.sovrascritti.
..............
nella di tmp si trovano i seguenti files

lista delle modifiche sul testo
diff_upd.txt

lsta degli omografi sovrascritti
diff_over.txt

------------------
C)
Per completare da browser eseguire

1) load_data

2) update_text

3) sistemazione omografi disamb. sovrascritti

4) update corpus

=========================
ANNULLARE LE CORREZIONI
=========================

textunupd.py <text_name>
N.B.
SOLO il nome del file
es.
textunupd.py kafka.txt
----------------------
Dal browser
load
del file

ATTENZIONE
 Il comando può essere lanciato UN SOLA VOLTA
 per ogni correzione da annullare

