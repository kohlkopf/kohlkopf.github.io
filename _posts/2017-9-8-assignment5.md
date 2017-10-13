---
layout: post
title: "Assignment 5"
date: 2017-9-1
author: "Kohl Kinning"

---

**de novo Transcriptome Assembly**
The objective of this assignment is to complete the tasks necessary for assembling and evaluating a transcriptome. The transcriptome of interest is the male brood pouch transcriptome of the Gulf pipefish, Syngnathus scovelli. The RNA-seq data are paired-end, 100 nt reads sequenced from Illumina TruSeq libraries on a HiSeq2000.

### Block 1: Cleaning, Filtering, and Digital Normalization of the Data

#### 1| Use the process\_shortreads program, which is part of the Stacks package, to clean the set of paired-end reads

``` bash
$ process_shortreads -1 SscoPE_R1.fastq -2 SscoPE_R2.fastq -i fastq -o Cleaned/ -c -q --adapter_mm 2 --adapter_1 AGATCGGAAGAGCACACGTCTGAACTCCAGTCAC --adapter_2 AGATCGGAAGAGCGTCGTGTAGGGAAAGAGTGT
```

#### 2| Using UNIX commands summarize the distributions of read lengths (one for R1s, one for R2s) for the trimmed data. Plot these distributions in R

``` bash
$ awk 'NR % 4 == 2' SscoPEclean_R1.fq | awk '{print length}' |sort | uniq -c > R1_lengths.txt
$ awk 'NR % 4 == 2' SscoPEclean_R2.fq | awk '{print length}' |sort | uniq -c > R2_lengths.txt
```

``` r
r1 = read.table("/Users/kohl/Documents/GradSchool/semester1/TopicsInGenomicAnalysis/Assignments/TopicsInGenomicAnalysis/assignment5/R1_lengths.txt")

r2 = read.table("/Users/kohl/Documents/GradSchool/semester1/TopicsInGenomicAnalysis/Assignments/TopicsInGenomicAnalysis/assignment5/R2_lengths.txt")

colnames(r1)[1:2] = c("counts", "lengths")
colnames(r2)[1:2] = c("counts", "lengths")
```

``` r
plot(r1$counts~r1$lengths, log = "y", col = "magenta4", pch = 3, xlab = "read lengths", ylab = "counts", main = "Trimmed Data Distributions")
points(r2$counts~r2$lengths, col = "green4", pch = 5)
```

![](assignment5_files/figure-markdown_github/unnamed-chunk-2-1.png)

#### 3| Filter the cleaned data for rare k-mers using `kmer_filter`

``` bash
ml purge
ml slurm
ml easybuild  icc/2017.1-GCC-6.3-2.27  impi/2017.1
ml Stacks/1.46

kmer_filter -1 ../SscoPEclean_R1.fq -2 ../SscoPEclean_R2.fq -i fastq -o Filtered/ --rare
```

#### 4| Run `kmer_filter` again, this time to normalize the cleaned, filtered data to 2 different coverages

*What's happening to the data?*
The cleaned and filtered data is being further culled. Only those reads with 40x coverage or 20x coverage are kept. The result is smaller files with less (higher quality) data.

With 40x coverage.

``` bash
ml purge
ml slurm
ml easybuild  icc/2017.1.132-GCC-6.3.0-2.27  impi/2017.1.132
ml Stacks/1.46

kmer_filter -1 SscoPEcleanfil_R1.fq -2 SscoPEcleanfil_R2.fq -i fastq -o Normed/ --rare --normalize 40
```

With 20x coverage.

``` bash
ml purge
ml slurm
ml easybuild  icc/2017.1.132-GCC-6.3.0-2.27  impi/2017.1.132
ml Stacks/1.46

kmer_filter -1 SscoPEcleanfil_R1.fq -2 SscoPEcleanfil_R2.fq -i fastq -o Normed/ --rare --normalize 20
```

#### 6| Now run kmer\_filter 3 times - on the cleaned set, the cleaned/filtered set, and the cleaned/filtered/20X normalized set

``` bash
ml purge
ml slurm
ml easybuild  icc/2017.1.132-GCC-6.3.0-2.27  impi/2017.1.132
ml Stacks/1.46

kmer_filter -1 Cleaned/SscoPEclean_R1.fq -2 Cleaned/SscoPEclean_R2.fq -i fastq -o Dists/ --k_dist

kmer_filter -1 Cleaned/Filtered/SscoPEcleanfil_R1.fq -2 Cleaned/Filtered/SscoPEcleanfil_R2.fq  -i fastq -o Dists/ --k_dist

kmer_filter -1 Cleaned/Filtered/Normed/SscoPEcleanfil_R1.fil.norm.fq  -2 Cleaned/Filtered/Normed/SscoPEcleanfil_R2.fil.norm.fq -i fastq -o Dists/ --k_dist
```

Plot the distributions.

``` r
cleaned = read.table("/Users/kohl/Documents/GradSchool/semester1/TopicsInGenomicAnalysis/Assignments/TopicsInGenomicAnalysis/assignment5//Dists/dist_1.tsv", header = TRUE)
filtered = read.table("/Users/kohl/Documents/GradSchool/semester1/TopicsInGenomicAnalysis/Assignments/TopicsInGenomicAnalysis/assignment5/Dists/dist_2.tsv", header = TRUE)
normed = read.table("/Users/kohl/Documents/GradSchool/semester1/TopicsInGenomicAnalysis/Assignments/TopicsInGenomicAnalysis/assignment5/Dists/dist_3.tsv", header = TRUE)


plot(log(cleaned$Count)~log(cleaned$KmerFrequency),
      main="Cleaned, filtered, and normalized k-mer frequencies",
     type="n",
     xaxt="n",
     yaxt="n",
     xlab="k-mer frequency",
     ylab="counts")
points(log(cleaned$Count)~log(cleaned$KmerFrequency), pch = ".")
points(log(filtered$Count)~log(filtered$KmerFrequency), col = "green4",pch = ".")
points(log(normed$Count)~log(normed$KmerFrequency), col = "magenta4", pch = ".")

legend(9, 15, legend = c("cleaned", "filtered", "normalized"), col = c("green4", "black", "magenta4"), lty = 1)
```

![](assignment5_files/figure-markdown_github/unnamed-chunk-3-1.png) \#\#\# Block 2: Trinity Assembly

#### 1| Files produced after running Trinity

The files produced with “rare” in the name are from a Trinity assembly based on the “cleaned, rare-kmer-filtered only” Gulf pipefish reads from Block 1. The files with “40Xnorm” are output from a Trinity run based on the cleaned, rare-kmer-filtered, 40X-normalized reads.

``` bash
$ Trinity.pl --seqType fq --JM 50G --left $work/SscoPEcleanfil_R1.fq \--right $work/SscoPEcleanfil_R2.fq --output $work/assembly --CPU 10 \--min_contig_length 300 --min_kmer_cov 3 --group_pairs_distance 800
```

### Block 3: Evaluation of Trinity Assemblies

#### 1| Retrieve the Trinity files

``` bash
/home/csmall/Bi623/trinity/tri_rare.fasta
/home/csmall/Bi623/trinity/tri_rare.timing 
/home/csmall/Bi623/trinity/tri_40Xnorm.fasta 
/home/csmall/Bi623/trinity/tri_40Xnorm.timing
```

#### 2| Files produced by Trinity

The files with “rare” in the name are from a Trinity assembly based on the “cleaned, rare-kmer-filtered only” Gulf pipefish reads from Block 1. The files with “40Xnorm” are output from a Trinity run based on the cleaned, rare-kmer-filtered, 40X-normalized reads. Look at the information in the .timing files.

*Do any differences between the rare and 40Xnorm assemblies stand out?*

The 40X assembly had 81,798,333 kmers, whereas the rare kmer assembly had 86,151,364. The latter had 4.35303110^{6} more kmers than the 40X assembly. This is a huge difference!

#### 4| Assembly stats

Using information in the two assembly files, calculate the number of transcripts, the maximum transcript length, the minimum transcript length, the mean transcript length, and the median transcript length. Plot the contig length distributions for each assembly.

``` bash
$ sed -e 's/\(^>.*$\)/#\1#/' tri_rare.fasta | tr -d "\r" | tr -d "\n" | sed -e 's/$/#/' | tr "#" "\n" | sed -e '/^$/d' | grep -Po [A-Z].+ | sed 's/[^"]//g' | awk '{ print length }' > seq_tri_rare.fasta

$ sed -e 's/\(^>.*$\)/#\1#/' tri_40Xnorm.fasta | tr -d "\r" | tr -d "\n" | sed -e 's/$/#/' | tr "#" "\n" | sed -e '/^$/d' | grep -Po [A-Z].+ | awk '{ print length }' > seq_tri_40Xnorm.fasta
```

``` r
rare = read.table("/Users/kohl/Documents/GradSchool/semester1/TopicsInGenomicAnalysis/Assignments/TopicsInGenomicAnalysis/assignment5/seq_tri_rare.fasta")
colnames(rare) = "length"

forty = read.table("/Users/kohl/Documents/GradSchool/semester1/TopicsInGenomicAnalysis/Assignments/TopicsInGenomicAnalysis/assignment5/seq_tri_40Xnorm.fasta")
colnames(forty) = "length"
```

``` r
summary(rare)
```

    ##      length     
    ##  Min.   :  301  
    ##  1st Qu.:  856  
    ##  Median : 1960  
    ##  Mean   : 2483  
    ##  3rd Qu.: 3440  
    ##  Max.   :18857

``` r
summary(forty)
```

    ##      length     
    ##  Min.   :  301  
    ##  1st Qu.: 1041  
    ##  Median : 2139  
    ##  Mean   : 2600  
    ##  3rd Qu.: 3546  
    ##  Max.   :22465

``` r
par(mfrow=c(2,2))

hist(rare$length, ylim = c(0, 35000), xlim = c(0, 15000), xlab = "transcript length", main = "Rare kmer Lengths")
hist(forty$length, ylim = c(0, 35000), xlim = c(0, 15000), xlab = "transcript length", main = "40X mer Coverage Lengths")

boxplot(rare$length, ylim = c(0, 25000))
boxplot(forty$length, ylim = c(0, 25000))
```

![](assignment5_files/figure-markdown_github/unnamed-chunk-7-1.png)

#### 5| Assembly quality

*Based on your assembly statistics and what you know about transcripts, comment on whether there is a clear difference in quality between the two Trinity assemblies.*

When considering assembly statistics, the 40X assembly wins out. It has a higher median, mean, and maximum length compare to the rare kmer assembly.

*Comment on differences in the total number of transcripts and transcript groups (“loci”) for the two assemblies. Basically, how many of the transcripts belong to groups that represent a bundle of similar sequences? What might transcripts within a bundle represent?*

I find 9757 unique transcripts in the 40X assembly and 9442 unique transcripts in the rare kmer assembly. The 40X assembly has more unique transcripts than the rare kmer assembly, but the difference is not very large. The latter has 0.9677155 of the uniquue transcripts that the former does.

I find 18378 unique clusters in the 40X assembly and 17106 unique clusters for the rare kmer assembly. Again, the 40X assembly has more unique clusters but the difference is not very large. The latter has 0.9307868 of the unique clusters that the former does.

The software assembles bundles of fragment alignments to reduce running time and memory use. Each bundle typically contains the fragments from no more than a few genes.

#### 6| Build a stickleback database, BLAST pipefish transcripts against stickleback protein sequences

``` bash
$ makeblastdb -in Gasterosteus_aculeatus.BROADS1.pep.all.fa -dbtype prot -out stickle 
```

``` bash
ml BLAST+/2.2.27

blastx -db stickle -query ../tri_40Xnorm.fasta -evalue 1e-5 -max_target_seqs 1 -outfmt 6 -out 40Xnorm_stickle_blast
```

``` bash
ml BLAST+/2.2.27

blastx -db stickle -query ../tri_rare.fasta -evalue 1e-5 -max_target_seqs 1 -outfmt 6 -out rare_stickle_blast
```

#### 8| BLAST results

For each top stickleback BLAST hit you identify, look up the human readable gene name (AKA external gene ID) from the stickleback file. Produce a table of the top BLAST hits you identified for each pipefish transcript, including the trinity transcript ID, stickleback blast hit e-value, stickleback blast hit protein ID, and stickleback hit external gene ID.

*Are there more unique stickleback hits for one assembly vs. the other?*

The assembly filtering for rare kmers only had significantly more unique hits than the one normalized to 40X coverage. This is expected as 40X kmer coverage is a stringent parameter.

#### 9| CEGs

Look at the file `/home/csmall/Bi623/trinity/rare_ceg.completeness_report`.

*What does this file tell you about transcriptome completeness for CEGs, and redundancy within our rare-kmer-filtered assembly?*

Our CEG completeness report is excellent. We see that 245 of 248 of the ultra-conserved eukaryotic genes were recoverd. We also see that on average there are 3 orthologs per CEG found in the genome. We are missing a couple of CEGS that have completelely matched, but two of the three missing are found as partial matches. I've read that it's rare to see all core genes present, even when you allow for partial matches. A 98.79% completeness is a good result.

